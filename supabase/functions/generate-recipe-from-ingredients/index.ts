import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function extractJsonFromResponse(response: string): unknown {
  let cleaned = response
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const jsonStart = cleaned.search(/[\{\[]/);
  const jsonEnd = cleaned.lastIndexOf(jsonStart !== -1 && cleaned[jsonStart] === '[' ? ']' : '}');

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("No JSON object found in response");
  }

  cleaned = cleaned.substring(jsonStart, jsonEnd + 1);

  try {
    return JSON.parse(cleaned);
  } catch {
    // Fix common truncation/formatting issues
    cleaned = cleaned
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      .replace(/[\x00-\x1F\x7F]/g, "");

    // Try to repair truncated JSON by closing open structures
    let openBraces = 0, openBrackets = 0;
    for (const ch of cleaned) {
      if (ch === '{') openBraces++;
      if (ch === '}') openBraces--;
      if (ch === '[') openBrackets++;
      if (ch === ']') openBrackets--;
    }

    // Remove trailing comma if present
    cleaned = cleaned.replace(/,\s*$/, '');

    while (openBraces > 0) { cleaned += '}'; openBraces--; }
    while (openBrackets > 0) { cleaned += ']'; openBrackets--; }

    // Remove trailing commas again after closing
    cleaned = cleaned.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");

    return JSON.parse(cleaned);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients } = await req.json();
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Please provide an array of ingredients' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get ingredient substitutions from database
    const { data: substitutions } = await supabase
      .from('ingredient_substitutions')
      .select('*');

    const substitutionText = substitutions && substitutions.length > 0
      ? `\n\nAvailable ingredient substitutions:\n${substitutions.map(s => 
          `${s.original_ingredient} can be substituted with ${s.substitute_ingredient} (${s.ratio})`
        ).join('\n')}`
      : '';

    console.log('Generating recipe for ingredients:', ingredients);

    const systemPrompt = `You are an expert chef and recipe creator. Generate EXACTLY 20 different, diverse recipes based on the provided ingredients. Each recipe must be complete with detailed cooking methods.
    
Format your response as a JSON object:
{
  "recipes": [
    {
      "name": "Recipe name",
      "confidence": 85-98,
      "cuisine": "Italian/Indian/Mexican/etc.",
      "difficulty": "Easy/Medium/Hard",
      "ingredients": ["ingredient 1 with exact quantity", "ingredient 2 with exact quantity", ...],
      "instructions": ["Detailed step 1 with temperature, timing, and technique", "Detailed step 2...", ...],
      "cookTime": "25 minutes",
      "prepTime": "10 minutes",
      "servings": 4,
      "calories": 380,
      "tips": "Pro chef tip for this dish",
      "substitutions": {
        "ingredient1": "alternative ingredient"
      }
    }
  ]
}

Guidelines:
- Generate EXACTLY 20 unique recipes - mix different cuisines and cooking styles
- Each recipe MUST have at least 5-8 detailed cooking steps explaining technique, heat level, timing
- Include prep time AND cook time separately
- Add a pro chef tip for each recipe
- Include cuisine type and difficulty level
- Vary the difficulty: include easy, medium, and hard recipes
- Cover different meal types: appetizers, mains, sides, snacks, desserts if applicable
- Be creative but practical with the given ingredients
- Include specific quantities for all ingredients
- Estimate realistic calories${substitutionText}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate 20 different recipes using these ingredients: ${ingredients.join(', ')}. Make them diverse across cuisines and difficulty levels.` }
        ],
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add more credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to generate recipe' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);

    // Parse the JSON response with robust extraction
    let result;
    try {
      result = extractJsonFromResponse(aiResponse);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return new Response(
        JSON.stringify({ error: 'Failed to parse recipe data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle both single recipe and multiple recipes format
    const recipes = result.recipes || [result];

    console.log(`Generated ${recipes.length} recipes successfully`);

    return new Response(
      JSON.stringify({ recipes, recipe: recipes[0] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-recipe-from-ingredients:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
