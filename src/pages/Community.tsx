import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommunityRecipe {
  id: string;
  user_id: string;
  dish_name: string;
  ingredients: any;
  instructions: any;
  prep_time: number;
  cook_time: number;
  servings: number;
  calories: number;
  confidence_score: number;
  likes_count: number;
  created_at: string;
}

const Community = () => {
  const [recipes, setRecipes] = useState<CommunityRecipe[]>([]);
  const [usernames, setUsernames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [likedRecipes, setLikedRecipes] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    fetchRecipes();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      fetchLikes(user.id);
    }
  };

  const fetchLikes = async (userId: string) => {
    const { data } = await supabase
      .from("recipe_likes")
      .select("recipe_id")
      .eq("user_id", userId);
    
    if (data) {
      setLikedRecipes(new Set(data.map(like => like.recipe_id)));
    }
  };

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from("community_recipes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (data) {
        setRecipes(data);
        
        // Fetch usernames for all unique user_ids
        const uniqueUserIds = [...new Set(data.map(r => r.user_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, username")
          .in("id", uniqueUserIds);
        
        if (profilesData) {
          const usernameMap: Record<string, string> = {};
          profilesData.forEach(profile => {
            usernameMap[profile.id] = profile.username || "Anonymous";
          });
          setUsernames(usernameMap);
        }
      }
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

  const handleLike = async (recipeId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like recipes",
        variant: "destructive",
      });
      return;
    }

    const isLiked = likedRecipes.has(recipeId);

    try {
      if (isLiked) {
        const { error } = await supabase
          .from("recipe_likes")
          .delete()
          .eq("recipe_id", recipeId)
          .eq("user_id", user.id);

        if (error) throw error;
        
        setLikedRecipes(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
      } else {
        const { error } = await supabase
          .from("recipe_likes")
          .insert({ recipe_id: recipeId, user_id: user.id });

        if (error) throw error;
        
        setLikedRecipes(prev => new Set(prev).add(recipeId));
      }

      fetchRecipes();
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
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Community Recipes</h1>
          
          {recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No community recipes yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="relative">
                  <RecipeCard
                    recipe={{
                      name: recipe.dish_name,
                      ingredients: recipe.ingredients,
                      instructions: recipe.instructions,
                      cookTime: `${recipe.cook_time} mins`,
                      servings: recipe.servings,
                      calories: recipe.calories,
                      confidence: recipe.confidence_score,
                    }}
                  />
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(recipe.id)}
                      className="p-0 h-auto"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          likedRecipes.has(recipe.id)
                            ? "fill-red-500 text-red-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                    <span className="text-sm font-medium">{recipe.likes_count}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    By {usernames[recipe.user_id] || "Anonymous"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
