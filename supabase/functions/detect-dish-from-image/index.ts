import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Please provide an image in base64 format' }),
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

    console.log('Analyzing image for dish detection...');

    const systemPrompt = `You are an expert food recognition AI and chef. Analyze the provided food image and identify the dish, then generate a complete recipe.

Format your response as a JSON object with the following structure:
{
  "name": "Detected dish name",
  "confidence": 85-98 (your confidence in the detection),
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
- Accurately identify the dish from the image
- Provide complete recipe with specific quantities
- Include clear, step-by-step cooking instructions
- Suggest suitable ingredient substitutions
- Be realistic about detection confidence
- If you're not sure, choose the most likely dish`;

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
          { 
            role: 'user', 
            content: [
              {
                type: 'text',
                text: 'What dish is in this image? Provide a complete recipe for it.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        temperature: 0.7,
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
        JSON.stringify({ error: 'Failed to detect dish from image' }),
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
        JSON.stringify({ error: 'Failed to parse dish detection data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Dish detected and recipe generated successfully');

    return new Response(
      JSON.stringify({ recipe }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in detect-dish-from-image:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
