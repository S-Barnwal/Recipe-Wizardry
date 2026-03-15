import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import IngredientInput from "@/components/IngredientInput";
import ImageUpload from "@/components/ImageUpload";
import RecipeCard from "@/components/RecipeCard";
import DishComparison from "@/components/DishComparison";
import FoodRecommendations from "@/components/FoodRecommendations";
import LeftoverDishGenerator from "@/components/LeftoverDishGenerator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Share2 } from "lucide-react";

const Index = () => {
  const [recipe, setRecipe] = useState<any>(null);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isLoadingLeftovers, setIsLoadingLeftovers] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [similarImages, setSimilarImages] = useState<any[]>([]);
  const [allRecipes, setAllRecipes] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleIngredientGenerate = async (ingredients: string[]) => {
    setIsLoadingIngredients(true);
    setRecipe(null);
    setSimilarImages([]);
    setAllRecipes([]);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipe-from-ingredients', {
        body: { ingredients }
      });
      if (error) throw error;
      if (data?.recipes && data.recipes.length > 0) {
        setAllRecipes(data.recipes);
        setRecipe(data.recipes[0]);
        toast({ title: "🎉 Recipes generated!", description: `${data.recipes.length} delicious recipes are ready!` });
      } else if (data?.recipe) {
        setRecipe(data.recipe);
        setAllRecipes([data.recipe]);
        toast({ title: "Recipe generated!", description: "Your delicious recipe is ready." });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to generate recipe.", variant: "destructive" });
    } finally {
      setIsLoadingIngredients(false);
    }
  };

  const handleImageGenerate = async (file: File) => {
    setIsLoadingImage(true);
    setRecipe(null);
    setSimilarImages([]);
    setAllRecipes([]);
    try {
      const reader = new FileReader();
      const imageBase64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke('detect-dish-from-image', {
        body: { imageBase64 }
      });
      if (error) throw error;

      if (data?.error === 'not_food' || data?.recipe?.error === 'not_food') {
        const msg = data?.message || data?.recipe?.funny_message || data?.recipe?.message || "Not food!";
        const score = data?.foodness_score || data?.recipe?.foodness_score || 0;
        toast({
          title: `😂 Not Food! (${score}% food-ness)`,
          description: msg,
          variant: "destructive",
        });
        return;
      }

      if (data?.recipe) {
        setRecipe(data.recipe);
        setSimilarImages(data.recipe.similar_images || []);
        setAllRecipes([data.recipe]);
        toast({ title: "Dish detected!", description: `Recipe generated for ${data.recipe.name}` });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to detect dish.", variant: "destructive" });
    } finally {
      setIsLoadingImage(false);
    }
  };

  const handleDishNameGenerate = async (dishName: string) => {
    setIsLoadingImage(true);
    setRecipe(null);
    setAllRecipes([]);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipe-from-ingredients', {
        body: { ingredients: [dishName], isDishName: true }
      });
      if (error) throw error;
      if (data?.recipe) {
        setRecipe(data.recipe);
        setAllRecipes([data.recipe]);
        toast({ title: "Recipe generated!", description: `Recipe for ${dishName} is ready.` });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to generate recipe.", variant: "destructive" });
    } finally {
      setIsLoadingImage(false);
    }
  };

  const handleLeftoverGenerate = async (leftovers: string[]) => {
    setIsLoadingLeftovers(true);
    setRecipe(null);
    setAllRecipes([]);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipe-from-ingredients', {
        body: { ingredients: leftovers }
      });
      if (error) throw error;
      if (data?.recipes && data.recipes.length > 0) {
        setAllRecipes(data.recipes);
        setRecipe(data.recipes[0]);
        toast({ title: "🎉 Leftover recipes generated!", description: `${data.recipes.length} new dishes from your leftovers!` });
      } else if (data?.recipe) {
        setRecipe(data.recipe);
        setAllRecipes([data.recipe]);
        toast({ title: "Leftover recipe generated!", description: "A new dish from your leftovers!" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to generate recipe.", variant: "destructive" });
    } finally {
      setIsLoadingLeftovers(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to save recipes", variant: "destructive" });
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
      toast({ title: "Recipe saved!", description: "Check it out in My Recipes" });
    } catch (error: any) {
      toast({ title: "Error saving recipe", description: error.message, variant: "destructive" });
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
            {/* Food Recommendations */}
            <FoodRecommendations onCategorySelect={(category) => {
              toast({ title: "Category Selected", description: `Exploring ${category} recipes` });
            }} />

            {/* Create Your Recipe */}
            <div id="create-recipe" className="text-center mb-10 pt-8">
              <h2 className="text-3xl font-bold mb-3">Create Your Recipe</h2>
              <p className="text-muted-foreground">Choose your preferred input method</p>
            </div>

            {/* Three sections side by side on large screens */}
            <div className="space-y-8">
              <IngredientInput onGenerate={handleIngredientGenerate} isLoading={isLoadingIngredients} />

              <ImageUpload
                onGenerate={handleImageGenerate}
                onDishNameGenerate={handleDishNameGenerate}
                isLoading={isLoadingImage}
                similarImages={similarImages}
              />

              <LeftoverDishGenerator onGenerate={handleLeftoverGenerate} isLoading={isLoadingLeftovers} />
            </div>

            {/* Recipe Results */}
            {allRecipes.length > 0 && (
              <div className="max-w-6xl mx-auto space-y-6 mt-12">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold">🍽️ Generated Recipes ({allRecipes.length})</h2>
                    <p className="text-muted-foreground">Click any recipe card to see full cooking method</p>
                  </div>
                  <div className="flex gap-2">
                    {allRecipes.length > 1 && <DishComparison recipes={allRecipes} />}
                    <Button onClick={handleSaveRecipe} disabled={saving || !user} variant="default">
                      {saving ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                      ) : (
                        <><Save className="h-4 w-4 mr-2" />{user ? "Save Recipe" : "Sign in to Save"}</>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Recipe Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {allRecipes.map((r, idx) => (
                    <RecipeCard key={idx} recipe={r} compact />
                  ))}
                </div>
              </div>
            )}

            {/* Single recipe from image detection */}
            {recipe && allRecipes.length === 0 && (
              <div className="max-w-4xl mx-auto space-y-4 mt-12">
                <div className="flex justify-between items-center">
                  <div className="flex-1" />
                  <Button onClick={handleSaveRecipe} disabled={saving || !user} variant="default">
                    {saving ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                    ) : (
                      <><Save className="h-4 w-4 mr-2" />{user ? "Save Recipe" : "Sign in to Save"}</>
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
