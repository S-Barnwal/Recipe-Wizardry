-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create user_recipes table (saved recipes)
CREATE TABLE public.user_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dish_name text NOT NULL,
  ingredients jsonb NOT NULL,
  instructions jsonb NOT NULL,
  prep_time integer,
  cook_time integer,
  servings integer,
  calories integer,
  confidence_score numeric,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.user_recipes ENABLE ROW LEVEL SECURITY;

-- User recipes policies
CREATE POLICY "Users can view their own recipes"
  ON public.user_recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recipes"
  ON public.user_recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes"
  ON public.user_recipes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes"
  ON public.user_recipes FOR DELETE
  USING (auth.uid() = user_id);

-- Create community_recipes table (shared recipes)
CREATE TABLE public.community_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dish_name text NOT NULL,
  ingredients jsonb NOT NULL,
  instructions jsonb NOT NULL,
  prep_time integer,
  cook_time integer,
  servings integer,
  calories integer,
  confidence_score numeric,
  likes_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.community_recipes ENABLE ROW LEVEL SECURITY;

-- Community recipes policies
CREATE POLICY "Community recipes are viewable by everyone"
  ON public.community_recipes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert community recipes"
  ON public.community_recipes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own community recipes"
  ON public.community_recipes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own community recipes"
  ON public.community_recipes FOR DELETE
  USING (auth.uid() = user_id);

-- Create recipe_likes table
CREATE TABLE public.recipe_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id uuid REFERENCES public.community_recipes(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

ALTER TABLE public.recipe_likes ENABLE ROW LEVEL SECURITY;

-- Recipe likes policies
CREATE POLICY "Anyone can view recipe likes"
  ON public.recipe_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like recipes"
  ON public.recipe_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike recipes"
  ON public.recipe_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  RETURN new;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update likes count
CREATE OR REPLACE FUNCTION public.update_recipe_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_recipes
    SET likes_count = likes_count + 1
    WHERE id = NEW.recipe_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_recipes
    SET likes_count = likes_count - 1
    WHERE id = OLD.recipe_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger for likes count
CREATE TRIGGER on_recipe_like_change
  AFTER INSERT OR DELETE ON public.recipe_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_recipe_likes_count();