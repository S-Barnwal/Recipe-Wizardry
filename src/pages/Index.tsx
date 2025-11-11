import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import IngredientInput from "@/components/IngredientInput";
import ImageUpload from "@/components/ImageUpload";
import RecipeCard from "@/components/RecipeCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [recipe, setRecipe] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleIngredientGenerate = async (ingredients: string[]) => {
    setIsLoading(true);
    setRecipe(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipe-from-ingredients', {
        body: { ingredients }
      });

      if (error) {
        console.error('Error generating recipe:', error);
        toast({
          title: "Error generating recipe",
          description: error.message || "Please try again",
          variant: "destructive",
        });
        return;
      }

      if (data && data.recipe) {
        setRecipe(data.recipe);
        toast({
          title: "Recipe generated!",
          description: "Your delicious recipe is ready.",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageGenerate = async (file: File) => {
    setIsLoading(true);
    setRecipe(null);
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const imageBase64 = await base64Promise;

      const { data, error } = await supabase.functions.invoke('detect-dish-from-image', {
        body: { imageBase64 }
      });

      if (error) {
        console.error('Error detecting dish:', error);
        toast({
          title: "Error detecting dish",
          description: error.message || "Please try again",
          variant: "destructive",
        });
        return;
      }

      if (data && data.recipe) {
        setRecipe(data.recipe);
        toast({
          title: "Dish detected!",
          description: "Recipe generated from your image.",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to detect dish. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
