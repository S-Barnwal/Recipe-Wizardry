-- Create ingredients table
CREATE TABLE IF NOT EXISTS public.ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- e.g., 'vegetable', 'grain', 'protein', 'dairy', 'spice'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create dishes table
CREATE TABLE IF NOT EXISTS public.dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cuisine_type TEXT, -- e.g., 'italian', 'indian', 'mexican'
  difficulty TEXT, -- e.g., 'easy', 'medium', 'hard'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id UUID REFERENCES public.dishes(id) ON DELETE CASCADE,
  instructions JSONB NOT NULL, -- Array of instruction steps
  ingredients JSONB NOT NULL, -- Array of ingredients with quantities
  prep_time INTEGER, -- in minutes
  cook_time INTEGER, -- in minutes
  servings INTEGER,
  calories INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create ingredient_substitutions table
CREATE TABLE IF NOT EXISTS public.ingredient_substitutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_ingredient TEXT NOT NULL,
  substitute_ingredient TEXT NOT NULL,
  ratio TEXT, -- e.g., '1:1' or '2:1'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create dish_ingredients junction table
CREATE TABLE IF NOT EXISTS public.dish_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id UUID REFERENCES public.dishes(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES public.ingredients(id) ON DELETE CASCADE,
  UNIQUE(dish_id, ingredient_id)
);

-- Enable RLS
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredient_substitutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dish_ingredients ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a recipe discovery app)
CREATE POLICY "Anyone can view ingredients" ON public.ingredients FOR SELECT USING (true);
CREATE POLICY "Anyone can view dishes" ON public.dishes FOR SELECT USING (true);
CREATE POLICY "Anyone can view recipes" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Anyone can view substitutions" ON public.ingredient_substitutions FOR SELECT USING (true);
CREATE POLICY "Anyone can view dish ingredients" ON public.dish_ingredients FOR SELECT USING (true);

-- Insert sample ingredients
INSERT INTO public.ingredients (name, category) VALUES
  ('Tomato', 'vegetable'),
  ('Onion', 'vegetable'),
  ('Garlic', 'vegetable'),
  ('Bell Pepper', 'vegetable'),
  ('Zucchini', 'vegetable'),
  ('Carrot', 'vegetable'),
  ('Spinach', 'vegetable'),
  ('Broccoli', 'vegetable'),
  ('Rice', 'grain'),
  ('Pasta', 'grain'),
  ('Flour', 'grain'),
  ('Bread', 'grain'),
  ('Chicken', 'protein'),
  ('Beef', 'protein'),
  ('Fish', 'protein'),
  ('Eggs', 'protein'),
  ('Tofu', 'protein'),
  ('Lentils', 'protein'),
  ('Milk', 'dairy'),
  ('Cheese', 'dairy'),
  ('Yogurt', 'dairy'),
  ('Butter', 'dairy'),
  ('Olive Oil', 'oil'),
  ('Salt', 'spice'),
  ('Pepper', 'spice'),
  ('Cumin', 'spice'),
  ('Paprika', 'spice'),
  ('Basil', 'herb'),
  ('Cilantro', 'herb'),
  ('Parsley', 'herb')
ON CONFLICT (name) DO NOTHING;

-- Insert sample substitutions
INSERT INTO public.ingredient_substitutions (original_ingredient, substitute_ingredient, ratio, notes) VALUES
  ('Paneer', 'Tofu', '1:1', 'Great vegan alternative with similar texture'),
  ('Butter', 'Olive Oil', '1:1', 'Healthier option, may change flavor slightly'),
  ('Milk', 'Almond Milk', '1:1', 'Lactose-free alternative'),
  ('Sugar', 'Honey', '1:1', 'Natural sweetener option'),
  ('Pasta', 'Zucchini Noodles', '1:1', 'Low-carb alternative'),
  ('Rice', 'Cauliflower Rice', '1:1', 'Low-carb, gluten-free option'),
  ('Chicken', 'Tofu', '1:1', 'Vegetarian protein option'),
  ('Beef', 'Mushrooms', '1:1', 'Vegetarian umami-rich option'),
  ('Soy Sauce', 'Coconut Aminos', '1:1', 'Gluten-free soy sauce alternative'),
  ('Yogurt', 'Sour Cream', '1:1', 'Similar tangy flavor')
ON CONFLICT DO NOTHING;