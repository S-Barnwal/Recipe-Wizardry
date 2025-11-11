import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const systemPrompt = `You are an expert chef and recipe creator. Generate a complete, detailed recipe based on the provided ingredients. 
    
Format your response as a JSON object with the following structure:
{
  "name": "Recipe name",
  "confidence": 85-98 (how confident you are that this recipe will work well),
  "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity", ...],
  "instructions": ["step 1", "step 2", ...],
  "cookTime": "25 minutes",
  "servings": 4,
  "calories": 380,
  "substitutions": {
    "ingredient1": "alternative ingredient",
    "ingredient2": "alternative ingredient"
  }
}

Guidelines:
- Be creative but practical
- Include specific quantities
- Provide clear, step-by-step instructions
- Suggest suitable substitutions based on the available substitution data
- Estimate cooking time, servings, and calories
- Make sure the recipe is delicious and achievable${substitutionText}`;

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
          { role: 'user', content: `Generate a recipe using these ingredients: ${ingredients.join(', ')}` }
        ],
        temperature: 0.8,
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

    // Parse the JSON response
    let recipe;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                       aiResponse.match(/```\n([\s\S]*?)\n```/) ||
                       [null, aiResponse];
      recipe = JSON.parse(jsonMatch[1] || aiResponse);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return new Response(
        JSON.stringify({ error: 'Failed to parse recipe data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Recipe generated successfully');

    return new Response(
      JSON.stringify({ recipe }),
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
