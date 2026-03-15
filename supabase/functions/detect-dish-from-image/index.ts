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
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Please provide an image in base64 format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing image for dish detection...');

    const systemPrompt = `You are an expert food recognition AI and chef with a great sense of humor. Analyze the provided image using fuzzy logic to determine what it contains.

STEP 1 - FUZZY CLASSIFICATION:
Rate the image on a "food-ness" scale from 0 to 100:
- 0-15: Clearly NOT food (people, cars, buildings, electronics, animals, landscapes, random objects)
- 16-40: Vaguely food-adjacent (kitchen items, empty plates, raw unprocessed items)
- 41-70: Partially food-related but unclear or inedible
- 71-100: Clearly food/dish

STEP 2 - RESPOND BASED ON SCORE:

If food-ness score is 0-40, respond with a FUNNY roast. Pick a random style:
{"error": "not_food", "foodness_score": <score>, "detected_object": "<what you actually see>", "funny_message": "<hilarious roast>"}

Example funny messages (vary these, be creative and savage):
- For a shoe: "👟 That's a fine looking shoe! Unfortunately my culinary skills don't extend to sole food. Try uploading something that doesn't walk."
- For a car: "🚗 Vroom vroom! That's a snack on wheels... wait, no it's just wheels. Feed me food, not fuel!"
- For a person: "👤 I appreciate the selfie, but I'm a recipe AI, not a dating app! Unless you want me to roast YOU... 🔥"
- For a cat: "🐱 Cute kitty! But I generate recipes, not cat memes. Though I hear cats love fish recipes..."
- For a laptop: "💻 Ah yes, the classic 'laptop tartare'. Crunchy exterior, shocking interior. 0/10 would not recommend eating."
- For a building: "🏢 That's some fine architecture, but I can't cook concrete. Send me something edible!"
- For random object: "🤔 I've seen some weird ingredients but this takes the cake... except it's NOT cake!"

If food-ness score is 41-70, respond with:
{"error": "not_food", "foodness_score": <score>, "detected_object": "<what you see>", "funny_message": "🤔 Hmm, that's <what it looks like>. It's giving food vibes but I'm not confident enough to cook it. Try a clearer food photo!"}

If food-ness score is 71-100, identify the dish and generate a complete recipe as JSON:
{
  "name": "Detected dish name",
  "confidence": <foodness_score>,
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

IMPORTANT: Be creative and different with each funny response. Use emojis. Make people laugh!`;

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
                text: 'Analyze this image. Is it food? If yes, what dish is it and provide the recipe.'
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

    let recipe;
    try {
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                       aiResponse.match(/```\n([\s\S]*?)\n```/) ||
                       [null, aiResponse];
      recipe = JSON.parse(jsonMatch[1] || aiResponse);
      
      // Check if AI detected non-food — return as success with the funny data so frontend can display it
      if (recipe.error === 'not_food') {
        return new Response(
          JSON.stringify({ 
            error: 'not_food',
            foodness_score: recipe.foodness_score || 0,
            message: recipe.funny_message || recipe.message || 'That does not look like food!',
            detected_object: recipe.detected_object || 'unknown',
            recipe: recipe
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return new Response(
        JSON.stringify({ error: 'Failed to parse dish detection data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Detected dish:', recipe.dish_name || recipe.name);

    // Fetch similar dish images from database
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    const { data: dishImages, error: dbError } = await supabase
      .from('dish_images')
      .select('*')
      .ilike('dish_name', `%${recipe.dish_name || recipe.name}%`)
      .limit(5);

    if (dbError) {
      console.error("Error fetching dish images:", dbError);
    }

    // Add similar images to response
    recipe.similar_images = dishImages || [];

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
