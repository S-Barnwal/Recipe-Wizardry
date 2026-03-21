import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeReviews from "@/components/RecipeReviews";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowLeft, Clock, Users, Flame, Globe, Copy, Heart, Star, Lightbulb, BarChart3, Save, Share2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import food images
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
import margheritaPizza from "@/assets/margherita-pizza.jpg";
import carbonara from "@/assets/carbonara.jpg";
import tiramisu from "@/assets/tiramisu.jpg";
import kungPaoChicken from "@/assets/kung-pao-chicken.jpg";
import dimSum from "@/assets/dim-sum.jpg";
import friedRice from "@/assets/fried-rice.jpg";
import tacosAlPastor from "@/assets/tacos-al-pastor.jpg";
import enchiladas from "@/assets/enchiladas.jpg";
import churros from "@/assets/churros.jpg";

const dishImages: Record<string, string> = {
  'butter chicken': butterChicken, 'murgh makhani': butterChicken,
  'biryani': biryani, 'dum biryani': biryani, 'hyderabadi': biryani,
  'masala dosa': masalaDosa, 'dosa': masalaDosa,
  'palak paneer': palakPaneer, 'saag paneer': palakPaneer,
  'chole bhature': choleBhature, 'chhole bhature': choleBhature,
  'samosa': samosa, 'dal makhani': dalMakhani, 'daal makhani': dalMakhani,
  'tandoori chicken': tandooriChicken, 'tandoori': tandooriChicken,
  'gulab jamun': gulabJamun, 'jalebi': jalebi,
  'aloo gobi': alooGobi, 'gobi aloo': alooGobi,
  'pani puri': paniPuri, 'golgappa': paniPuri,
  'malai kofta': malaiKofta, 'kofta': malaiKofta,
  'paneer tikka': paneerTikka,
  'chicken tikka masala': chickenTikkaMasala, 'tikka masala': chickenTikkaMasala,
  'vada pav': vadaPav, 'vada pao': vadaPav,
  'rajma chawal': rajmaChawal, 'rajma': rajmaChawal,
  'pav bhaji': pavBhaji, 'rogan josh': roganJosh,
  'margherita pizza': margheritaPizza, 'pizza': margheritaPizza,
  'carbonara': carbonara, 'tiramisu': tiramisu,
  'kung pao': kungPaoChicken, 'kung pao chicken': kungPaoChicken,
  'dim sum': dimSum, 'dumpling': dimSum, 'dumplings': dimSum,
  'fried rice': friedRice, 'yangzhou': friedRice,
  'tacos al pastor': tacosAlPastor, 'al pastor': tacosAlPastor,
  'enchilada': enchiladas, 'enchiladas': enchiladas,
  'churro': churros, 'churros': churros,
};

const foodImages = [indianCurry, italianPasta, mexicanTacos, mediterraneanSalad, soupBowl, grilledSteak, asianBowl, seafoodDish, grilledChicken, dessertChocolate, saladBowl, heroPasta];

function getImage(name: string, cuisine?: string): string {
  const text = (name + ' ' + (cuisine || '')).toLowerCase();
  for (const [key, img] of Object.entries(dishImages)) {
    if (text.includes(key)) return img;
  }
  if (text.includes('italian') || text.includes('pasta') || text.includes('spaghetti') || text.includes('lasagna')) return italianPasta;
  if (text.includes('mexican') || text.includes('taco') || text.includes('burrito')) return mexicanTacos;
  if (text.includes('mediterranean') || text.includes('greek')) return mediterraneanSalad;
  if (text.includes('soup') || text.includes('stew')) return soupBowl;
  if (text.includes('steak') || text.includes('beef') || text.includes('grill') || text.includes('bbq')) return grilledSteak;
  if (text.includes('asian') || text.includes('chinese') || text.includes('japanese') || text.includes('thai') || text.includes('noodle') || text.includes('wok')) return asianBowl;
  if (text.includes('seafood') || text.includes('fish') || text.includes('shrimp') || text.includes('prawn')) return seafoodDish;
  if (text.includes('chicken') || text.includes('turkey')) return grilledChicken;
  if (text.includes('dessert') || text.includes('cake') || text.includes('chocolate') || text.includes('sweet')) return dessertChocolate;
  if (text.includes('salad') || text.includes('vegan')) return saladBowl;
  if (text.includes('indian') || text.includes('curry') || text.includes('korma') || text.includes('masala')) return indianCurry;
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
  return foodImages[Math.abs(hash) % foodImages.length];
}

const difficultyStyles: Record<string, string> = {
  Easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const RecipeDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Recipe can come from navigation state (generated) or from DB (community)
  const [recipe, setRecipe] = useState<any>(location.state?.recipe || null);
  const [communityData, setCommunityData] = useState<any>(location.state?.communityData || null);
  const [loading, setLoading] = useState(!recipe && !communityData);
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [authorName, setAuthorName] = useState("Anonymous Chef");

  const isCommunity = !!communityData || (id && id !== "generated");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  // Fetch community recipe from DB if not in state
  useEffect(() => {
    if (!recipe && !communityData && id && id !== "generated") {
      const fetchRecipe = async () => {
        const { data, error } = await supabase.from("community_recipes").select("*").eq("id", id).single();
        if (error || !data) {
          toast({ title: "Recipe not found", variant: "destructive" });
          navigate(-1);
          return;
        }
        setCommunityData(data);
        setLoading(false);
      };
      fetchRecipe();
    }
  }, [id]);

  // Fetch author name and like status for community recipes
  useEffect(() => {
    if (!communityData) return;
    supabase.from("profiles").select("username").eq("id", communityData.user_id).single()
      .then(({ data }) => { if (data?.username) setAuthorName(data.username); });
    if (user) {
      supabase.from("recipe_likes").select("id").eq("recipe_id", communityData.id).eq("user_id", user.id).single()
        .then(({ data }) => setIsLiked(!!data));
    }
  }, [communityData, user]);

  // Normalize recipe data
  const displayName = communityData?.dish_name || recipe?.name || "Recipe";
  const cuisine = communityData?.cuisine_type || recipe?.cuisine || "";
  const difficulty = recipe?.difficulty || "";
  const ingredients: string[] = communityData ? (Array.isArray(communityData.ingredients) ? communityData.ingredients : []) : (recipe?.ingredients || []);
  const instructions: string[] = communityData ? (Array.isArray(communityData.instructions) ? communityData.instructions : []) : (recipe?.instructions || []);
  const prepTime = communityData?.prep_time ? `${communityData.prep_time} min` : recipe?.prepTime;
  const cookTime = communityData?.cook_time ? `${communityData.cook_time} min` : recipe?.cookTime;
  const servings = communityData?.servings || recipe?.servings;
  const calories = communityData?.calories || recipe?.calories;
  const confidence = communityData?.confidence_score || recipe?.confidence;
  const likesCount = communityData?.likes_count || 0;
  const reviewCount = communityData?.review_count || 0;
  const image = getImage(displayName, cuisine);
  const diffColor = difficultyStyles[difficulty] || "";

  const handleCopy = () => {
    const text = `${displayName}\n\nIngredients:\n${ingredients.join('\n')}\n\nInstructions:\n${instructions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Recipe copied to clipboard." });
  };

  const handleSave = async () => {
    if (!user) { toast({ title: "Sign in required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      await supabase.from("user_recipes").insert({
        user_id: user.id, dish_name: displayName, ingredients, instructions,
        prep_time: parseInt(String(communityData?.prep_time || recipe?.cookTime)) || null,
        cook_time: parseInt(String(communityData?.cook_time || recipe?.cookTime)) || null,
        servings, calories, confidence_score: confidence,
      });
      toast({ title: "Recipe saved!", description: "Check it in My Recipes" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleShare = async () => {
    if (!user) { toast({ title: "Sign in required", variant: "destructive" }); return; }
    setSharing(true);
    try {
      await supabase.from("community_recipes").insert({
        user_id: user.id, dish_name: displayName, ingredients, instructions,
        prep_time: parseInt(String(recipe?.prepTime)) || null,
        cook_time: parseInt(String(recipe?.cookTime)) || null,
        servings, calories, confidence_score: confidence, cuisine_type: cuisine || null,
      });
      toast({ title: "🎉 Shared!", description: "Your recipe is now in the community!" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally { setSharing(false); }
  };

  const handleLike = async () => {
    if (!user) { toast({ title: "Sign in required", variant: "destructive" }); return; }
    if (!communityData) return;
    try {
      if (isLiked) {
        await supabase.from("recipe_likes").delete().eq("recipe_id", communityData.id).eq("user_id", user.id);
        setIsLiked(false);
        setCommunityData({ ...communityData, likes_count: Math.max(0, (communityData.likes_count || 0) - 1) });
      } else {
        await supabase.from("recipe_likes").insert({ recipe_id: communityData.id, user_id: user.id });
        setIsLiked(true);
        setCommunityData({ ...communityData, likes_count: (communityData.likes_count || 0) + 1 });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Image - Full Width */}
        <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
          <img src={image} alt={displayName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <Button
            variant="secondary"
            size="sm"
            className="absolute top-20 left-4 md:left-8 backdrop-blur-sm bg-background/60 hover:bg-background/80"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          <div className="absolute bottom-6 left-4 md:left-8 right-4 md:right-8">
            <div className="flex items-center gap-2 mb-3">
              {difficulty && <span className={`text-xs px-3 py-1 rounded-full font-semibold ${diffColor}`}>{difficulty}</span>}
              {cuisine && (
                <Badge variant="outline" className="text-xs bg-background/60 backdrop-blur-sm border-white/30 text-white">
                  <Globe className="h-3 w-3 mr-1" /> {cuisine}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white">{displayName}</h1>
            {isCommunity && (
              <p className="text-white/70 text-sm mt-2">By {authorName}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Confidence */}
          {confidence && (
            <div className="space-y-1 max-w-md mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">AI Match Confidence</span>
                <span className="font-bold text-primary">{confidence}%</span>
              </div>
              <Progress value={confidence} className="h-2" />
            </div>
          )}

          {/* Stats Bar */}
          <div className="flex flex-wrap gap-4 md:gap-6 p-4 rounded-xl bg-muted/50 mb-6">
            {prepTime && (
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <div><span className="text-muted-foreground text-xs">Prep</span><p className="font-semibold text-sm">{prepTime}</p></div>
              </div>
            )}
            {cookTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div><span className="text-muted-foreground text-xs">Cook</span><p className="font-semibold text-sm">{cookTime}</p></div>
              </div>
            )}
            {servings && (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div><span className="text-muted-foreground text-xs">Serves</span><p className="font-semibold text-sm">{servings}</p></div>
              </div>
            )}
            {calories && (
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                <div><span className="text-muted-foreground text-xs">Calories</span><p className="font-semibold text-sm">{calories} cal</p></div>
              </div>
            )}
            {isCommunity && (
              <div className="flex items-center gap-2 ml-auto">
                <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                <span className="font-semibold text-sm">{communityData?.likes_count || 0} likes</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button size="sm" variant="outline" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1.5" /> Copy Recipe
            </Button>
            {!isCommunity && (
              <>
                <Button size="sm" onClick={handleSave} disabled={saving || !user}>
                  {saving ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-1.5" />{user ? "Save Recipe" : "Sign in to Save"}</>}
                </Button>
                <Button size="sm" variant="outline" onClick={handleShare} disabled={sharing || !user}>
                  {sharing ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />Sharing...</> : <><Share2 className="h-4 w-4 mr-1.5" />{user ? "Share to Community" : "Sign in to Share"}</>}
                </Button>
              </>
            )}
            {isCommunity && (
              <>
                <Button size="sm" variant={isLiked ? "default" : "outline"} onClick={handleLike}>
                  <Heart className={`h-4 w-4 mr-1.5 ${isLiked ? "fill-current" : ""}`} />
                  {isLiked ? "Liked" : "Like"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowReviews(!showReviews)}>
                  <Star className="h-4 w-4 mr-1.5" /> Reviews ({reviewCount})
                </Button>
                <Button size="sm" variant="outline" onClick={handleSave} disabled={saving || !user}>
                  <Save className="h-4 w-4 mr-1.5" /> {user ? "Save to My Recipes" : "Sign in to Save"}
                </Button>
              </>
            )}
          </div>

          {/* Ingredients + Instructions - Full Width Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                🥘 Ingredients
                <span className="text-sm font-normal text-muted-foreground">({ingredients.length} items)</span>
              </h2>
              <ul className="space-y-2">
                {ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-primary mt-0.5 font-bold text-lg">•</span>
                    <span className="leading-relaxed">{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                👨‍🍳 Cooking Method
                <span className="text-sm font-normal text-muted-foreground">({instructions.length} steps)</span>
              </h2>
              <ol className="space-y-4">
                {instructions.map((step, i) => (
                  <li key={i} className="flex gap-4 text-sm">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Chef Tips */}
          {recipe?.tips && (
            <div className="p-5 bg-primary/5 rounded-xl border border-primary/10 mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Pro Chef Tip</h3>
              </div>
              <p className="text-muted-foreground">{recipe.tips}</p>
            </div>
          )}

          {/* Substitutions */}
          {recipe?.substitutions && Object.keys(recipe.substitutions).length > 0 && (
            <div className="p-5 bg-accent/10 rounded-xl mb-8">
              <h3 className="font-semibold mb-3">💡 Substitutions</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(recipe.substitutions).map(([original, substitute]) => (
                  <span key={original} className="text-sm px-3 py-1.5 bg-background rounded-full border">
                    <span className="font-medium">{original}</span>
                    <span className="text-muted-foreground"> → </span>
                    <span>{substitute as string}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews (community) */}
          {showReviews && communityData && (
            <div className="border-t pt-8">
              <RecipeReviews recipeId={communityData.id} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecipeDetail;
