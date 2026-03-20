import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChefHat,
  Heart,
  Calendar,
  BookOpen,
  TrendingUp,
  Clock,
  Utensils,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    savedRecipes: 0,
    sharedRecipes: 0,
    totalLikes: 0,
    mealPlans: 0,
  });
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);
  const [upcomingMeals, setUpcomingMeals] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/auth"); return; }
    setUser(user);
    await Promise.all([
      fetchStats(user.id),
      fetchRecentRecipes(user.id),
      fetchUpcomingMeals(user.id),
      fetchProfile(user.id),
    ]);
    setLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setProfile(data);
    if (data?.dietary_preferences?.length) {
      fetchRecommendations(data.dietary_preferences);
    }
  };

  const fetchStats = async (userId: string) => {
    const [ur, cr, mp, likes] = await Promise.all([
      supabase.from("user_recipes").select("id", { count: "exact" }).eq("user_id", userId),
      supabase.from("community_recipes").select("id", { count: "exact" }).eq("user_id", userId),
      supabase.from("meal_plans").select("id", { count: "exact" }).eq("user_id", userId),
      supabase.from("community_recipes").select("likes_count").eq("user_id", userId),
    ]);
    const totalLikes = likes.data?.reduce((s, r) => s + (r.likes_count || 0), 0) || 0;
    setStats({
      savedRecipes: ur.count || 0,
      sharedRecipes: cr.count || 0,
      totalLikes,
      mealPlans: mp.count || 0,
    });
  };

  const fetchRecentRecipes = async (userId: string) => {
    const { data } = await supabase
      .from("user_recipes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(4);
    setRecentRecipes(data || []);
  };

  const fetchUpcomingMeals = async (userId: string) => {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("meal_plans")
      .select("*")
      .eq("user_id", userId)
      .gte("planned_date", today)
      .order("planned_date", { ascending: true })
      .limit(5);
    setUpcomingMeals(data || []);
  };

  const fetchRecommendations = async (preferences: string[]) => {
    const { data } = await supabase
      .from("community_recipes")
      .select("*")
      .order("average_rating", { ascending: false })
      .limit(6);
    setRecommendations(data || []);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { icon: BookOpen, label: "Saved Recipes", value: stats.savedRecipes, color: "text-primary", bg: "bg-primary/10" },
    { icon: Utensils, label: "Shared to Community", value: stats.sharedRecipes, color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: Heart, label: "Total Likes", value: stats.totalLikes, color: "text-rose-500", bg: "bg-rose-50" },
    { icon: Calendar, label: "Meal Plans", value: stats.mealPlans, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {profile?.username || "Chef"} 👋
            </h1>
            <p className="text-muted-foreground mt-1">Here's what's cooking in your kitchen</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((s, i) => (
              <Card key={i} className="p-5 hover:shadow-md transition-shadow">
                <div className={`inline-flex p-2.5 rounded-xl ${s.bg} mb-3`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Recipes */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Recent Recipes</h2>
                <Link to="/my-recipes">
                  <Button variant="ghost" size="sm">
                    View all <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              {recentRecipes.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {recentRecipes.map((recipe) => (
                    <Card key={recipe.id} className="p-5 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-foreground mb-2">{recipe.dish_name}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        {recipe.prep_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {recipe.prep_time + (recipe.cook_time || 0)}m
                          </span>
                        )}
                        {recipe.cuisine_type && <Badge variant="secondary">{recipe.cuisine_type}</Badge>}
                      </div>
                      {recipe.dietary_restrictions?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {recipe.dietary_restrictions.slice(0, 3).map((d: string) => (
                            <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <ChefHat className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground mb-3">No recipes saved yet</p>
                  <Link to="/">
                    <Button size="sm">Generate Your First Recipe</Button>
                  </Link>
                </Card>
              )}
            </div>

            {/* Upcoming Meals */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Upcoming Meals</h2>
                <Link to="/meal-planner">
                  <Button variant="ghost" size="sm">
                    Plan <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              {upcomingMeals.length > 0 ? (
                <div className="space-y-3">
                  {upcomingMeals.map((meal) => (
                    <Card key={meal.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground text-sm">{meal.recipe_name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(meal.planned_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">{meal.meal_type}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">No upcoming meals</p>
                  <Link to="/meal-planner">
                    <Button size="sm" variant="outline">Plan Meals</Button>
                  </Link>
                </Card>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h2 className="text-xl font-semibold text-foreground">Recommended For You</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((recipe) => (
                  <Card key={recipe.id} className="p-5 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-foreground mb-1">{recipe.dish_name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      {recipe.cuisine_type && <Badge variant="secondary">{recipe.cuisine_type}</Badge>}
                      {recipe.average_rating > 0 && (
                        <span className="flex items-center gap-1">⭐ {Number(recipe.average_rating).toFixed(1)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {recipe.likes_count || 0}</span>
                      <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {recipe.review_count || 0} reviews</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Dietary Preferences */}
          {profile?.dietary_preferences?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-foreground mb-3">Your Preferences</h2>
              <div className="flex flex-wrap gap-2">
                {profile.dietary_preferences.map((pref: string) => (
                  <Badge key={pref} variant="secondary" className="px-3 py-1">{pref}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
