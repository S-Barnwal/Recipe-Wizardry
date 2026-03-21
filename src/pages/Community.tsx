import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeReviews from "@/components/RecipeReviews";
import { Loader2, Heart, Star, Search, Clock, Users, Flame, Globe, ChefHat, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import indianCurry from "@/assets/indian-curry.jpg";
import italianPasta from "@/assets/italian-pasta.jpg";
import mexicanTacos from "@/assets/mexican-tacos.jpg";
import mediterraneanSalad from "@/assets/mediterranean-salad.jpg";
import soupBowl from "@/assets/soup-bowl.jpg";
import grilledSteak from "@/assets/grilled-steak.jpg";
import asianBowl from "@/assets/asian-bowl.jpg";
import seafoodDish from "@/assets/seafood-dish.jpg";
import grilledChicken from "@/assets/grilled-chicken.jpg";
import dessertChocolate from "@/assets/dessert-chocolate.jpg";
import saladBowl from "@/assets/salad-bowl.jpg";
import heroPasta from "@/assets/hero-pasta.jpg";
// Indian dish-specific images
import butterChicken from "@/assets/butter-chicken.jpg";
import biryani from "@/assets/biryani.jpg";
import masalaDosa from "@/assets/masala-dosa.jpg";
import palakPaneer from "@/assets/palak-paneer.jpg";
import choleBhature from "@/assets/chole-bhature.jpg";
import samosa from "@/assets/samosa.jpg";
import dalMakhani from "@/assets/dal-makhani.jpg";
import tandooriChicken from "@/assets/tandoori-chicken.jpg";
import gulabJamun from "@/assets/gulab-jamun.jpg";
import jalebi from "@/assets/jalebi.jpg";
import alooGobi from "@/assets/aloo-gobi.jpg";
import paniPuri from "@/assets/pani-puri.jpg";
import malaiKofta from "@/assets/malai-kofta.jpg";
import paneerTikka from "@/assets/paneer-tikka.jpg";
import chickenTikkaMasala from "@/assets/chicken-tikka-masala.jpg";
import vadaPav from "@/assets/vada-pav.jpg";
import rajmaChawal from "@/assets/rajma-chawal.jpg";
import pavBhaji from "@/assets/pav-bhaji.jpg";
import roganJosh from "@/assets/rogan-josh.jpg";

const foodImages = [
  indianCurry, italianPasta, mexicanTacos, mediterraneanSalad,
  soupBowl, grilledSteak, asianBowl, seafoodDish,
  grilledChicken, dessertChocolate, saladBowl, heroPasta,
];

// Specific Indian dish name-to-image mapping
const indianDishImages: Record<string, string> = {
  'butter chicken': butterChicken,
  'murgh makhani': butterChicken,
  'biryani': biryani,
  'dum biryani': biryani,
  'hyderabadi': biryani,
  'masala dosa': masalaDosa,
  'dosa': masalaDosa,
  'palak paneer': palakPaneer,
  'saag paneer': palakPaneer,
  'chole bhature': choleBhature,
  'chhole bhature': choleBhature,
  'samosa': samosa,
  'dal makhani': dalMakhani,
  'daal makhani': dalMakhani,
  'tandoori chicken': tandooriChicken,
  'tandoori': tandooriChicken,
  'gulab jamun': gulabJamun,
  'jalebi': jalebi,
  'aloo gobi': alooGobi,
  'gobi aloo': alooGobi,
  'pani puri': paniPuri,
  'golgappa': paniPuri,
  'malai kofta': malaiKofta,
  'kofta': malaiKofta,
  'paneer tikka': paneerTikka,
  'chicken tikka masala': chickenTikkaMasala,
  'tikka masala': chickenTikkaMasala,
  'vada pav': vadaPav,
  'vada pao': vadaPav,
  'rajma chawal': rajmaChawal,
  'rajma': rajmaChawal,
  'pav bhaji': pavBhaji,
  'rogan josh': roganJosh,
};

function getRecipeImage(name: string, cuisine?: string): string {
  const text = (name + ' ' + (cuisine || '')).toLowerCase();
  
  // Check specific Indian dish matches first
  for (const [key, img] of Object.entries(indianDishImages)) {
    if (text.includes(key)) return img;
  }
  
  if (text.includes('italian') || text.includes('pasta') || text.includes('spaghetti')) return italianPasta;
  if (text.includes('mexican') || text.includes('taco') || text.includes('burrito')) return mexicanTacos;
  if (text.includes('mediterranean') || text.includes('greek')) return mediterraneanSalad;
  if (text.includes('soup') || text.includes('stew')) return soupBowl;
  if (text.includes('steak') || text.includes('beef') || text.includes('grill')) return grilledSteak;
  if (text.includes('asian') || text.includes('chinese') || text.includes('thai') || text.includes('noodle')) return asianBowl;
  if (text.includes('seafood') || text.includes('fish') || text.includes('shrimp')) return seafoodDish;
  if (text.includes('chicken') || text.includes('turkey')) return grilledChicken;
  if (text.includes('dessert') || text.includes('cake') || text.includes('chocolate')) return dessertChocolate;
  if (text.includes('salad') || text.includes('vegan')) return saladBowl;
  if (text.includes('indian') || text.includes('curry') || text.includes('korma') || text.includes('masala')) return indianCurry;
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
  return foodImages[Math.abs(hash) % foodImages.length];
}

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

const CUISINE_TYPES = ["All", "Italian", "Mexican", "Indian", "Chinese", "Japanese", "Thai", "Mediterranean", "American", "French", "Fusion"];
const DIETARY_OPTIONS = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Low-Carb"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "calories_low", label: "Low Calories" },
];

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
  const [sortBy, setSortBy] = useState("newest");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchRecipes();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) fetchLikes(user.id);
  };

  const fetchLikes = async (userId: string) => {
    const { data } = await supabase.from("recipe_likes").select("recipe_id").eq("user_id", userId);
    if (data) setLikedRecipes(new Set(data.map(like => like.recipe_id)));
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
        const uniqueUserIds = [...new Set(data.map(r => r.user_id))];
        if (uniqueUserIds.length > 0) {
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, username")
            .in("id", uniqueUserIds);
          if (profilesData) {
            const map: Record<string, string> = {};
            profilesData.forEach(p => { map[p.id] = p.username || "Anonymous Chef"; });
            setUsernames(map);
          }
        }
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation();
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to like recipes", variant: "destructive" });
      return;
    }
    const isLiked = likedRecipes.has(recipeId);
    try {
      if (isLiked) {
        await supabase.from("recipe_likes").delete().eq("recipe_id", recipeId).eq("user_id", user.id);
        setLikedRecipes(prev => { const s = new Set(prev); s.delete(recipeId); return s; });
      } else {
        await supabase.from("recipe_likes").insert({ recipe_id: recipeId, user_id: user.id });
        setLikedRecipes(prev => new Set(prev).add(recipeId));
      }
      fetchRecipes();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Filter & sort
  useEffect(() => {
    let filtered = [...recipes];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.dish_name.toLowerCase().includes(q) ||
        (Array.isArray(r.ingredients) && r.ingredients.some((ing: string) => String(ing).toLowerCase().includes(q))) ||
        (r.cuisine_type && r.cuisine_type.toLowerCase().includes(q))
      );
    }
    if (cuisineType !== "All") {
      filtered = filtered.filter(r => r.cuisine_type?.toLowerCase() === cuisineType.toLowerCase());
    }
    if (dietaryFilters.length > 0) {
      filtered = filtered.filter(r => dietaryFilters.every(f => r.dietary_restrictions?.includes(f)));
    }

    // Sort
    switch (sortBy) {
      case "popular": filtered.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0)); break;
      case "rating": filtered.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0)); break;
      case "calories_low": filtered.sort((a, b) => (a.calories || 999) - (b.calories || 999)); break;
      default: filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredRecipes(filtered);
  }, [searchQuery, cuisineType, dietaryFilters, sortBy, recipes]);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading community recipes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <ChefHat className="h-4 w-4" />
              Community Kitchen
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Discover & Share Recipes</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore recipes shared by our community of home chefs. Like, review, and get inspired!
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><ChefHat className="h-4 w-4" /> {recipes.length} Recipes</span>
              <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {recipes.reduce((sum, r) => sum + (r.likes_count || 0), 0)} Likes</span>
              <span className="flex items-center gap-1"><Star className="h-4 w-4" /> {recipes.reduce((sum, r) => sum + (r.review_count || 0), 0)} Reviews</span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="space-y-4 mb-8">
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[250px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search recipes, ingredients, or cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={cuisineType} onValueChange={setCuisineType}>
                <SelectTrigger className="w-[160px]">
                  <Globe className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CUISINE_TYPES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SortAsc className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map(opt => (
                <Badge
                  key={opt}
                  variant={dietaryFilters.includes(opt) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => setDietaryFilters(prev =>
                    prev.includes(opt) ? prev.filter(f => f !== opt) : [...prev, opt]
                  )}
                >
                  {opt}
                </Badge>
              ))}
            </div>
          </div>

          {/* Recipe Grid */}
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-20">
              <ChefHat className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
              <p className="text-muted-foreground">
                {recipes.length === 0
                  ? "Be the first to share a recipe with the community!"
                  : "Try adjusting your search or filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredRecipes.map((recipe) => {
                const image = getRecipeImage(recipe.dish_name, recipe.cuisine_type || undefined);
                const isLiked = likedRecipes.has(recipe.id);

                return (
                  <Card
                    key={recipe.id}
                    className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border hover:border-primary/30"
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={image}
                        alt={recipe.dish_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Like button */}
                      <button
                        onClick={(e) => handleLike(e, recipe.id)}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-colors"
                      >
                        <Heart className={`h-4 w-4 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-foreground"}`} />
                      </button>

                      {/* Badges */}
                      <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                        {recipe.cuisine_type && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-background/80 text-foreground backdrop-blur-sm">
                            {recipe.cuisine_type}
                          </span>
                        )}
                      </div>

                      {/* Title on image */}
                      <div className="absolute bottom-2.5 left-3 right-3">
                        <h3 className="font-bold text-white text-sm leading-tight line-clamp-2">{recipe.dish_name}</h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 space-y-2.5">
                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        {recipe.cook_time && (
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{recipe.cook_time}m</span>
                        )}
                        {recipe.calories && (
                          <span className="flex items-center gap-1"><Flame className="h-3 w-3" />{recipe.calories} cal</span>
                        )}
                        {recipe.servings && (
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{recipe.servings}</span>
                        )}
                      </div>

                      {/* Rating & Likes */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1">
                            <Heart className={`h-3 w-3 ${isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                            <span className="font-medium">{recipe.likes_count || 0}</span>
                          </span>
                          {(recipe.average_rating || 0) > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              <span className="font-medium">{recipe.average_rating?.toFixed(1)}</span>
                              <span className="text-muted-foreground">({recipe.review_count})</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Author & time */}
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
                        <span>👨‍🍳 {usernames[recipe.user_id] || "Anonymous"}</span>
                        <span>{timeAgo(recipe.created_at)}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Recipe Detail Dialog */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => { setSelectedRecipe(null); setShowReviews(null); }}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0">
          {selectedRecipe && (
            <>
              {/* Hero image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={getRecipeImage(selectedRecipe.dish_name, selectedRecipe.cuisine_type || undefined)}
                  alt={selectedRecipe.dish_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="flex items-center gap-2 mb-2">
                    {selectedRecipe.cuisine_type && (
                      <Badge variant="outline" className="text-xs bg-background/60 backdrop-blur-sm border-white/30 text-white">
                        <Globe className="h-3 w-3 mr-1" />{selectedRecipe.cuisine_type}
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedRecipe.dish_name}</h2>
                  <p className="text-white/70 text-sm mt-1">
                    By {usernames[selectedRecipe.user_id] || "Anonymous"} · {timeAgo(selectedRecipe.created_at)}
                  </p>
                </div>
              </div>

              <div className="p-5 md:p-8 space-y-6">
                {/* Stats */}
                <div className="flex flex-wrap gap-4 p-3 rounded-xl bg-muted/50">
                  {selectedRecipe.prep_time && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <div><span className="text-muted-foreground text-xs">Prep</span><p className="font-semibold text-xs">{selectedRecipe.prep_time} min</p></div>
                    </div>
                  )}
                  {selectedRecipe.cook_time && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <div><span className="text-muted-foreground text-xs">Cook</span><p className="font-semibold text-xs">{selectedRecipe.cook_time} min</p></div>
                    </div>
                  )}
                  {selectedRecipe.servings && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <div><span className="text-muted-foreground text-xs">Serves</span><p className="font-semibold text-xs">{selectedRecipe.servings}</p></div>
                    </div>
                  )}
                  {selectedRecipe.calories && (
                    <div className="flex items-center gap-2 text-sm">
                      <Flame className="h-4 w-4 text-primary" />
                      <div><span className="text-muted-foreground text-xs">Calories</span><p className="font-semibold text-xs">{selectedRecipe.calories} cal</p></div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm ml-auto">
                    <Heart className={`h-4 w-4 ${likedRecipes.has(selectedRecipe.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                    <span className="font-semibold text-xs">{selectedRecipe.likes_count} likes</span>
                  </div>
                </div>

                {/* Like & Review actions */}
                <div className="flex gap-2">
                  <Button
                    variant={likedRecipes.has(selectedRecipe.id) ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => handleLike(e, selectedRecipe.id)}
                  >
                    <Heart className={`h-4 w-4 mr-1.5 ${likedRecipes.has(selectedRecipe.id) ? "fill-current" : ""}`} />
                    {likedRecipes.has(selectedRecipe.id) ? "Liked" : "Like"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReviews(showReviews ? null : selectedRecipe.id)}
                  >
                    <Star className="h-4 w-4 mr-1.5" />
                    Reviews ({selectedRecipe.review_count || 0})
                  </Button>
                </div>

                {/* Ingredients + Instructions */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      🥘 Ingredients
                      <span className="text-xs font-normal text-muted-foreground">
                        ({Array.isArray(selectedRecipe.ingredients) ? selectedRecipe.ingredients.length : 0} items)
                      </span>
                    </h3>
                    <ul className="space-y-1.5">
                      {Array.isArray(selectedRecipe.ingredients) && selectedRecipe.ingredients.map((ing: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                          <span className="text-primary mt-0.5 font-bold">•</span>
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      👨‍🍳 Cooking Method
                      <span className="text-xs font-normal text-muted-foreground">
                        ({Array.isArray(selectedRecipe.instructions) ? selectedRecipe.instructions.length : 0} steps)
                      </span>
                    </h3>
                    <ol className="space-y-3">
                      {Array.isArray(selectedRecipe.instructions) && selectedRecipe.instructions.map((step: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Reviews section */}
                {showReviews && (
                  <div className="border-t pt-6">
                    <RecipeReviews recipeId={showReviews} />
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Community;
