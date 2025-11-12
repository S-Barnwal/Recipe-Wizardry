import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SavedRecipe {
  id: string;
  dish_name: string;
  ingredients: any;
  instructions: any;
  prep_time: number;
  cook_time: number;
  servings: number;
  calories: number;
  confidence_score: number;
  created_at: string;
}

const MyRecipes = () => {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    fetchRecipes();
  };

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from("user_recipes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_recipes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setRecipes(recipes.filter(r => r.id !== id));
      toast({
        title: "Success",
        description: "Recipe deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleShare = async (recipe: SavedRecipe) => {
    try {
      const { error } = await supabase
        .from("community_recipes")
        .insert({
          user_id: user.id,
          dish_name: recipe.dish_name,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          prep_time: recipe.prep_time,
          cook_time: recipe.cook_time,
          servings: recipe.servings,
          calories: recipe.calories,
          confidence_score: recipe.confidence_score,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Recipe shared to community",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-foreground">My Saved Recipes</h1>
          
          {recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't saved any recipes yet.</p>
              <Button onClick={() => navigate("/")}>Generate Your First Recipe</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={{
                    name: recipe.dish_name,
                    ingredients: recipe.ingredients,
                    instructions: recipe.instructions,
                    cookTime: `${recipe.cook_time} mins`,
                    servings: recipe.servings,
                    calories: recipe.calories,
                    confidence: recipe.confidence_score,
                  }}
                  onDelete={() => handleDelete(recipe.id)}
                  onShare={() => handleShare(recipe)}
                  showActions
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyRecipes;
