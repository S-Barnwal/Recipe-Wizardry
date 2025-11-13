import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Calendar, Trash2, Download, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MealPlan {
  id: string;
  recipe_name: string;
  meal_type: string;
  planned_date: string;
  ingredients: any;
}

const MealPlanner = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
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
    fetchMealPlans();
  };

  const fetchMealPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("meal_plans")
        .select("*")
        .order("planned_date", { ascending: true });

      if (error) throw error;
      setMealPlans(data || []);
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
        .from("meal_plans")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setMealPlans(mealPlans.filter(m => m.id !== id));
      toast({
        title: "Success",
        description: "Meal plan removed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateShoppingList = () => {
    const allIngredients = mealPlans.flatMap(plan => {
      const ingredients = plan.ingredients;
      if (Array.isArray(ingredients)) return ingredients;
      return [];
    });
    const uniqueIngredients = [...new Set(allIngredients)];
    
    const text = "Shopping List\n\n" + uniqueIngredients.map((ing, i) => `${i + 1}. ${ing}`).join("\n");
    
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shopping-list.txt";
    a.click();

    toast({
      title: "Shopping list downloaded!",
      description: "Your shopping list has been saved.",
    });
  };

  const groupByDate = () => {
    const grouped: { [key: string]: MealPlan[] } = {};
    mealPlans.forEach(plan => {
      if (!grouped[plan.planned_date]) {
        grouped[plan.planned_date] = [];
      }
      grouped[plan.planned_date].push(plan);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const groupedPlans = groupByDate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-foreground">Meal Planner</h1>
            {mealPlans.length > 0 && (
              <Button onClick={generateShoppingList}>
                <Download className="h-4 w-4 mr-2" />
                Download Shopping List
              </Button>
            )}
          </div>

          {mealPlans.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No meals planned yet.</p>
              <Button onClick={() => navigate("/my-recipes")}>
                Add Recipes to Meal Plan
              </Button>
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedPlans).map(([date, plans]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-semibold">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {plans.map((plan) => (
                      <Card key={plan.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary" className="capitalize">
                            {plan.meal_type}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(plan.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <h3 className="font-semibold mb-2">{plan.recipe_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {Array.isArray(plan.ingredients) ? plan.ingredients.length : 0} ingredients
                        </p>
                      </Card>
                    ))}
                  </div>
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

export default MealPlanner;
