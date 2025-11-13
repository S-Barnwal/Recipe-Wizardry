import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import SearchFilters from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  cuisine_type?: string;
  dietary_restrictions?: string[];
}

const MyRecipes = () => {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineType, setCuisineType] = useState("All");
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const [planningRecipe, setPlanningRecipe] = useState<SavedRecipe | null>(null);
  const [planDate, setPlanDate] = useState("");
  const [mealType, setMealType] = useState("dinner");
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
      setFilteredRecipes(data || []);
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

  const handleDietaryFilterToggle = (filter: string) => {
    setDietaryFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleAddToMealPlan = async () => {
    if (!planningRecipe || !planDate) return;

    try {
      const { error } = await supabase.from("meal_plans").insert({
        user_id: user.id,
        recipe_id: planningRecipe.id,
        recipe_name: planningRecipe.dish_name,
        recipe_type: "user",
        planned_date: planDate,
        meal_type: mealType,
        ingredients: planningRecipe.ingredients,
      });

      if (error) throw error;

      toast({
        title: "Added to meal plan!",
        description: "Recipe has been added to your meal planner.",
      });

      setPlanningRecipe(null);
      setPlanDate("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
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
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-foreground">My Saved Recipes</h1>
          
          {recipes.length > 0 && (
            <SearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              cuisineType={cuisineType}
              onCuisineChange={setCuisineType}
              dietaryFilters={dietaryFilters}
              onDietaryFilterToggle={handleDietaryFilterToggle}
            />
          )}

          {filteredRecipes.length === 0 && recipes.length > 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No recipes match your filters.</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't saved any recipes yet.</p>
              <Button onClick={() => navigate("/")}>Generate Your First Recipe</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
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
                  onAddToMealPlan={() => setPlanningRecipe(recipe)}
                  showActions
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      <Dialog open={!!planningRecipe} onOpenChange={() => setPlanningRecipe(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Meal Plan</DialogTitle>
            <DialogDescription>
              Plan when you want to cook {planningRecipe?.dish_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={planDate}
                onChange={(e) => setPlanDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddToMealPlan} className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Add to Meal Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyRecipes;
