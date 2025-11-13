-- Add cuisine_type and dietary_restrictions to user_recipes
ALTER TABLE public.user_recipes
ADD COLUMN IF NOT EXISTS cuisine_type TEXT,
ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT[];

-- Add cuisine_type and dietary_restrictions to community_recipes
ALTER TABLE public.community_recipes
ADD COLUMN IF NOT EXISTS cuisine_type TEXT,
ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT[];

-- Update profiles table for enhanced user profiles (skip avatar_url as it exists)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS dietary_preferences TEXT[];

-- Create recipe_reviews table
CREATE TABLE IF NOT EXISTS public.recipe_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.community_recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.recipe_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for recipe_reviews
CREATE POLICY "Anyone can view reviews"
ON public.recipe_reviews
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create reviews"
ON public.recipe_reviews
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
ON public.recipe_reviews
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
ON public.recipe_reviews
FOR DELETE
USING (auth.uid() = user_id);

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL,
  recipe_name TEXT NOT NULL,
  recipe_type TEXT NOT NULL CHECK (recipe_type IN ('user', 'community')),
  planned_date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  ingredients JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

-- RLS policies for meal_plans
CREATE POLICY "Users can view their own meal plans"
ON public.meal_plans
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meal plans"
ON public.meal_plans
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal plans"
ON public.meal_plans
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal plans"
ON public.meal_plans
FOR DELETE
USING (auth.uid() = user_id);

-- Add average rating to community_recipes
ALTER TABLE public.community_recipes
ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Function to update recipe rating stats
CREATE OR REPLACE FUNCTION public.update_recipe_rating_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.community_recipes
    SET 
      average_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM public.recipe_reviews
        WHERE recipe_id = NEW.recipe_id
      ),
      review_count = (
        SELECT COUNT(*)
        FROM public.recipe_reviews
        WHERE recipe_id = NEW.recipe_id
      )
    WHERE id = NEW.recipe_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_recipes
    SET 
      average_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM public.recipe_reviews
        WHERE recipe_id = OLD.recipe_id
      ),
      review_count = (
        SELECT COUNT(*)
        FROM public.recipe_reviews
        WHERE recipe_id = OLD.recipe_id
      )
    WHERE id = OLD.recipe_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger to update rating stats
DROP TRIGGER IF EXISTS update_recipe_rating_stats_trigger ON public.recipe_reviews;
CREATE TRIGGER update_recipe_rating_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.recipe_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_recipe_rating_stats();