import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import IngredientInput from "@/components/IngredientInput";
import ImageUpload from "@/components/ImageUpload";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save } from "lucide-react";

const Index = () => {
  const [recipe, setRecipe] = useState<any>(null);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [similarImages, setSimilarImages] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleIngredientGenerate = async (ingredients: string[]) => {
    setIsLoadingIngredients(true);
    setRecipe(null);
    setSimilarImages([]);
    
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
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.error || error.message;
      toast({
        title: "Error",
        description: errorMessage || "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingIngredients(false);
    }
  };

  const handleImageGenerate = async (file: File) => {
    setIsLoadingImage(true);
    setRecipe(null);
    setSimilarImages([]);
    
    try {
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

      if (data?.error === 'not_food' || data?.recipe?.error === 'not_food') {
        toast({
          title: "Invalid Input",
          description: data?.message || data?.recipe?.message || "This image does not appear to contain food. Please upload a food image.",
          variant: "destructive",
        });
        setRecipe(null);
        setSimilarImages([]);
        return;
      }

      if (data && data.recipe) {
        setRecipe(data.recipe);
        setSimilarImages(data.recipe.similar_images || []);
        toast({
          title: "Dish detected!",
          description: `Recipe generated for ${data.recipe.dish_name || data.recipe.name}`,
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.error || error.message;
      toast({
        title: "Error",
        description: errorMessage || "Failed to detect dish. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingImage(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save recipes",
        variant: "destructive",
      });
      return;
    }

    if (!recipe) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("user_recipes").insert({
        user_id: user.id,
        dish_name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prep_time: parseInt(recipe.cookTime) || null,
        cook_time: parseInt(recipe.cookTime) || null,
        servings: recipe.servings,
        calories: recipe.calories,
        confidence_score: recipe.confidence,
      });

      if (error) throw error;

      toast({
        title: "Recipe saved!",
        description: "Check it out in My Recipes",
      });
    } catch (error: any) {
      toast({
        title: "Error saving recipe",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
                isLoading={isLoadingIngredients}
              />

              <ImageUpload
                onGenerate={handleImageGenerate}
                isLoading={isLoadingImage}
                similarImages={similarImages}
              />
            </div>

            {recipe && (
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveRecipe}
                    disabled={saving || !user}
                    variant="default"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {user ? "Save Recipe" : "Sign in to Save"}
                      </>
                    )}
                  </Button>
                </div>
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
