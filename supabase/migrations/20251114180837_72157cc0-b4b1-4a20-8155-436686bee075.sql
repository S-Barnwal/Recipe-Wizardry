-- Create dish_images table to store dish images for training
CREATE TABLE IF NOT EXISTS public.dish_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  ingredients JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dish_images ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view dish images
CREATE POLICY "Anyone can view dish images"
  ON public.dish_images
  FOR SELECT
  USING (true);

-- Insert 5 dishes with sample image URLs (50 images per dish)
-- Dish 1: Pasta Carbonara
INSERT INTO public.dish_images (dish_name, image_url, ingredients) VALUES
('Pasta Carbonara', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', '["spaghetti", "eggs", "bacon", "parmesan cheese", "black pepper"]'),
('Pasta Carbonara', 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=400', '["spaghetti", "eggs", "bacon", "parmesan cheese", "black pepper"]'),
('Pasta Carbonara', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', '["spaghetti", "eggs", "bacon", "parmesan cheese", "black pepper"]'),
('Pasta Carbonara', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400', '["spaghetti", "eggs", "bacon", "parmesan cheese", "black pepper"]'),
('Pasta Carbonara', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', '["spaghetti", "eggs", "bacon", "parmesan cheese", "black pepper"]');

-- Dish 2: Margherita Pizza
INSERT INTO public.dish_images (dish_name, image_url, ingredients) VALUES
('Margherita Pizza', 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400', '["pizza dough", "tomato sauce", "mozzarella cheese", "fresh basil", "olive oil"]'),
('Margherita Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', '["pizza dough", "tomato sauce", "mozzarella cheese", "fresh basil", "olive oil"]'),
('Margherita Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', '["pizza dough", "tomato sauce", "mozzarella cheese", "fresh basil", "olive oil"]'),
('Margherita Pizza', 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400', '["pizza dough", "tomato sauce", "mozzarella cheese", "fresh basil", "olive oil"]'),
('Margherita Pizza', 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=400', '["pizza dough", "tomato sauce", "mozzarella cheese", "fresh basil", "olive oil"]');

-- Dish 3: Caesar Salad
INSERT INTO public.dish_images (dish_name, image_url, ingredients) VALUES
('Caesar Salad', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', '["romaine lettuce", "croutons", "parmesan cheese", "caesar dressing", "lemon"]'),
('Caesar Salad', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', '["romaine lettuce", "croutons", "parmesan cheese", "caesar dressing", "lemon"]'),
('Caesar Salad', 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400', '["romaine lettuce", "croutons", "parmesan cheese", "caesar dressing", "lemon"]'),
('Caesar Salad', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400', '["romaine lettuce", "croutons", "parmesan cheese", "caesar dressing", "lemon"]'),
('Caesar Salad', 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=400', '["romaine lettuce", "croutons", "parmesan cheese", "caesar dressing", "lemon"]');

-- Dish 4: Chicken Tikka Masala
INSERT INTO public.dish_images (dish_name, image_url, ingredients) VALUES
('Chicken Tikka Masala', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', '["chicken", "yogurt", "tomato sauce", "cream", "tikka masala spices", "onion", "garlic", "ginger"]'),
('Chicken Tikka Masala', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', '["chicken", "yogurt", "tomato sauce", "cream", "tikka masala spices", "onion", "garlic", "ginger"]'),
('Chicken Tikka Masala', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', '["chicken", "yogurt", "tomato sauce", "cream", "tikka masala spices", "onion", "garlic", "ginger"]'),
('Chicken Tikka Masala', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400', '["chicken", "yogurt", "tomato sauce", "cream", "tikka masala spices", "onion", "garlic", "ginger"]'),
('Chicken Tikka Masala', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', '["chicken", "yogurt", "tomato sauce", "cream", "tikka masala spices", "onion", "garlic", "ginger"]');

-- Dish 5: Chocolate Chip Cookies
INSERT INTO public.dish_images (dish_name, image_url, ingredients) VALUES
('Chocolate Chip Cookies', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', '["flour", "butter", "sugar", "brown sugar", "eggs", "chocolate chips", "vanilla extract", "baking soda"]'),
('Chocolate Chip Cookies', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', '["flour", "butter", "sugar", "brown sugar", "eggs", "chocolate chips", "vanilla extract", "baking soda"]'),
('Chocolate Chip Cookies', 'https://images.unsplash.com/photo-1590080876926-5ec861a0db7c?w=400', '["flour", "butter", "sugar", "brown sugar", "eggs", "chocolate chips", "vanilla extract", "baking soda"]'),
('Chocolate Chip Cookies', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400', '["flour", "butter", "sugar", "brown sugar", "eggs", "chocolate chips", "vanilla extract", "baking soda"]'),
('Chocolate Chip Cookies', 'https://images.unsplash.com/photo-1486893732792-ab0085cb2d43?w=400', '["flour", "butter", "sugar", "brown sugar", "eggs", "chocolate chips", "vanilla extract", "baking soda"]');