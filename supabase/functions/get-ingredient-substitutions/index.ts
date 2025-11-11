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
    const { ingredient } = await req.json();
    
    if (!ingredient) {
      return new Response(
        JSON.stringify({ error: 'Please provide an ingredient name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Searching for substitutions for:', ingredient);

    // Search for exact match first
    let { data: substitutions, error } = await supabase
      .from('ingredient_substitutions')
      .select('*')
      .ilike('original_ingredient', ingredient);

    // If no exact match, try partial match
    if (!substitutions || substitutions.length === 0) {
      const { data: partialMatches } = await supabase
        .from('ingredient_substitutions')
        .select('*')
        .ilike('original_ingredient', `%${ingredient}%`);
      
      substitutions = partialMatches || [];
    }

    console.log('Found substitutions:', substitutions);

    return new Response(
      JSON.stringify({ substitutions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-ingredient-substitutions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
