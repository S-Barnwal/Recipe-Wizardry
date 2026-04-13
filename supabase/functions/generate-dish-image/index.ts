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
    const { dishName } = await req.json();
    
    if (!dishName || typeof dishName !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Please provide a dish name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating image for dish:', dishName);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3.1-flash-image-preview',
        prompt: `A beautiful, appetizing, professional food photography of ${dishName}. Top-down or 45-degree angle view, on a clean plate, warm natural lighting, restaurant quality presentation, high resolution, photorealistic.`,
        n: 1,
        size: '512x512',
        response_format: 'b64_json',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Image generation error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate image' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const imageBase64 = data.data?.[0]?.b64_json;

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'No image generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ image: `data:image/png;base64,${imageBase64}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating dish image:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
