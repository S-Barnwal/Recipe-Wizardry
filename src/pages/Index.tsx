import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import IngredientInput from "@/components/IngredientInput";
import ImageUpload from "@/components/ImageUpload";
import RecipeCard from "@/components/RecipeCard";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [recipe, setRecipe] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleIngredientGenerate = async (ingredients: string[]) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRecipe({
        name: "Mediterranean Vegetable Pasta",
        confidence: 94,
        ingredients: [
          "400g pasta of your choice",
          "2 cups cherry tomatoes, halved",
          "1 zucchini, sliced",
          "1 bell pepper, diced",
          "3 cloves garlic, minced",
          "1/4 cup olive oil",
          "Fresh basil leaves",
          "Salt and pepper to taste",
          "Parmesan cheese (optional)",
        ],
        instructions: [
          "Bring a large pot of salted water to boil and cook pasta according to package instructions.",
          "While pasta cooks, heat olive oil in a large pan over medium heat.",
          "Add garlic and sauté for 1 minute until fragrant.",
          "Add cherry tomatoes, zucchini, and bell pepper. Cook for 5-7 minutes until vegetables are tender.",
          "Drain pasta and add to the pan with vegetables.",
          "Toss everything together, season with salt and pepper.",
          "Garnish with fresh basil and parmesan cheese before serving.",
        ],
        cookTime: "25 minutes",
        servings: 4,
        calories: 380,
        substitutions: {
          "Pasta": "Zucchini noodles or rice",
          "Olive oil": "Avocado oil or butter",
          "Parmesan": "Nutritional yeast (vegan)",
        },
      });
      setIsLoading(false);
      toast({
        title: "Recipe generated!",
        description: "Your delicious recipe is ready.",
      });
    }, 2000);
  };

  const handleImageGenerate = async (file: File) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRecipe({
        name: "Classic Margherita Pizza",
        confidence: 97,
        ingredients: [
          "1 pizza dough ball",
          "1 cup tomato sauce",
          "8 oz fresh mozzarella, sliced",
          "Fresh basil leaves",
          "2 tbsp olive oil",
          "Salt to taste",
          "1 clove garlic, minced",
        ],
        instructions: [
          "Preheat your oven to 475°F (245°C) with a pizza stone inside.",
          "Roll out the pizza dough on a floured surface to your desired thickness.",
          "Spread tomato sauce evenly over the dough, leaving a small border.",
          "Arrange mozzarella slices on top of the sauce.",
          "Drizzle with olive oil and sprinkle with minced garlic and salt.",
          "Carefully transfer to the preheated pizza stone.",
          "Bake for 12-15 minutes until crust is golden and cheese is bubbly.",
          "Remove from oven, top with fresh basil leaves, and serve immediately.",
        ],
        cookTime: "30 minutes",
        servings: 2,
        calories: 520,
        substitutions: {
          "Mozzarella": "Vegan cheese or ricotta",
          "Pizza dough": "Cauliflower crust or pita bread",
        },
      });
      setIsLoading(false);
      toast({
        title: "Dish detected!",
        description: "Recipe generated from your image.",
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <IngredientInput
                onGenerate={handleIngredientGenerate}
                isLoading={isLoading}
              />
              <ImageUpload
                onGenerate={handleImageGenerate}
                isLoading={isLoading}
              />
            </div>

            {recipe && (
              <div className="max-w-4xl mx-auto">
                <RecipeCard recipe={recipe} />
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
