import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import SearchFilters from "@/components/SearchFilters";
import RecipeReviews from "@/components/RecipeReviews";
import { Loader2, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  cuisine_type?: string;
  dietary_restrictions?: string[];
  average_rating?: number;
  review_count?: number;
}

const Community = () => {
  const [recipes, setRecipes] = useState<CommunityRecipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<CommunityRecipe[]>([]);
  const [usernames, setUsernames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [likedRecipes, setLikedRecipes] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineType, setCuisineType] = useState("All");
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
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
        setFilteredRecipes(data);
        
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

  const handleDietaryFilterToggle = (filter: string) => {
    setDietaryFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  useEffect(() => {
    let filtered = recipes;

    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.dish_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some((ing: string) =>
          ing.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (cuisineType !== "All") {
      filtered = filtered.filter(recipe =>
        recipe.cuisine_type?.toLowerCase() === cuisineType.toLowerCase()
      );
    }

    if (dietaryFilters.length > 0) {
      filtered = filtered.filter(recipe =>
        dietaryFilters.every(filter =>
          recipe.dietary_restrictions?.includes(filter)
        )
      );
    }

    setFilteredRecipes(filtered);
  }, [searchQuery, cuisineType, dietaryFilters, recipes]);

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
          
          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            cuisineType={cuisineType}
            onCuisineChange={setCuisineType}
            dietaryFilters={dietaryFilters}
            onDietaryFilterToggle={handleDietaryFilterToggle}
          />

          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No community recipes yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
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
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg">
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
                    {recipe.average_rating > 0 && (
                      <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-medium">{recipe.average_rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      By {usernames[recipe.user_id] || "Anonymous"}
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setSelectedRecipe(recipe.id)}
                    >
                      View Reviews ({recipe.review_count || 0})
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Recipe Reviews</DialogTitle>
          </DialogHeader>
          {selectedRecipe && <RecipeReviews recipeId={selectedRecipe} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Community;
