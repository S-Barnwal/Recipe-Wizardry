import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Clock, Users, Flame, Copy, BookmarkPlus, Trash2, Calendar, Share2, ChevronDown, ChevronUp, Lightbulb, Globe, BarChart3 } from "lucide-react";
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

interface Recipe {
  name: string;
  confidence?: number;
  cuisine?: string;
  difficulty?: string;
  ingredients: string[];
  instructions: string[];
  cookTime?: string;
  prepTime?: string;
  servings?: number;
  calories?: number;
  tips?: string;
  substitutions?: { [key: string]: string };
}

interface RecipeCardProps {
  recipe: Recipe;
  onDelete?: () => void;
  onShare?: () => void;
  onAddToMealPlan?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

const foodImages = [
  indianCurry, italianPasta, mexicanTacos, mediterraneanSalad,
  soupBowl, grilledSteak, asianBowl, seafoodDish,
  grilledChicken, dessertChocolate, saladBowl, heroPasta,
];

function getRecipeImage(recipe: Recipe, index?: number): string {
  const name = (recipe.name + ' ' + (recipe.cuisine || '')).toLowerCase();

  if (name.includes('indian') || name.includes('curry') || name.includes('korma') || name.includes('biryani') || name.includes('masala')) return indianCurry;
  if (name.includes('italian') || name.includes('pasta') || name.includes('spaghetti') || name.includes('lasagna')) return italianPasta;
  if (name.includes('mexican') || name.includes('taco') || name.includes('burrito') || name.includes('enchilada')) return mexicanTacos;
  if (name.includes('mediterranean') || name.includes('greek') || name.includes('feta')) return mediterraneanSalad;
  if (name.includes('soup') || name.includes('stew') || name.includes('chowder') || name.includes('broth')) return soupBowl;
  if (name.includes('steak') || name.includes('beef') || name.includes('grill') || name.includes('bbq')) return grilledSteak;
  if (name.includes('asian') || name.includes('chinese') || name.includes('japanese') || name.includes('thai') || name.includes('stir') || name.includes('noodle') || name.includes('wok')) return asianBowl;
  if (name.includes('seafood') || name.includes('fish') || name.includes('shrimp') || name.includes('salmon') || name.includes('prawn')) return seafoodDish;
  if (name.includes('chicken') || name.includes('poultry') || name.includes('turkey')) return grilledChicken;
  if (name.includes('dessert') || name.includes('cake') || name.includes('chocolate') || name.includes('sweet') || name.includes('cookie')) return dessertChocolate;
  if (name.includes('salad') || name.includes('bowl') || name.includes('veggie') || name.includes('vegan')) return saladBowl;

  // Fallback: use index to cycle through images
  const idx = index ?? Math.abs(hashCode(recipe.name)) % foodImages.length;
  return foodImages[idx % foodImages.length];
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

const difficultyStyles: Record<string, string> = {
  Easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const RecipeCard = ({ recipe, onDelete, onShare, onAddToMealPlan, showActions, compact }: RecipeCardProps) => {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(!compact);

  const handleCopy = () => {
    const text = `${recipe.name}\n\nIngredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Recipe copied to clipboard." });
  };

  const image = getRecipeImage(recipe);
  const diffColor = difficultyStyles[recipe.difficulty || ""] || difficultyStyles.Easy;

  // ── Compact Card ──
  if (compact && !expanded) {
    return (
      <Card
        className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border hover:border-primary/30"
        onClick={() => setExpanded(true)}
      >
        {/* Image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={image}
            alt={recipe.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Badges on image */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {recipe.difficulty && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${diffColor}`}>
                {recipe.difficulty}
              </span>
            )}
            {recipe.cuisine && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-background/80 text-foreground backdrop-blur-sm">
                {recipe.cuisine}
              </span>
            )}
          </div>

          {/* Title on image */}
          <div className="absolute bottom-2 left-3 right-3">
            <h3 className="font-bold text-sm text-white leading-tight line-clamp-2">{recipe.name}</h3>
          </div>
        </div>

        {/* Quick Info */}
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {recipe.cookTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />{recipe.cookTime}
              </span>
            )}
            {recipe.calories && (
              <span className="flex items-center gap-1">
                <Flame className="h-3 w-3" />{recipe.calories} cal
              </span>
            )}
            {recipe.servings && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />{recipe.servings}
              </span>
            )}
          </div>

          {/* Ingredient preview */}
          <div className="flex flex-wrap gap-1">
            {recipe.ingredients.slice(0, 3).map((ing, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground truncate max-w-[100px]">
                {ing.split(',')[0].replace(/^\d+[\w\s]*/i, '').trim() || ing.split(' ').slice(-1)[0]}
              </span>
            ))}
            {recipe.ingredients.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                +{recipe.ingredients.length - 3} more
              </span>
            )}
          </div>

          {recipe.confidence && (
            <div>
              <Progress value={recipe.confidence} className="h-1" />
              <span className="text-[10px] text-muted-foreground">{recipe.confidence}% match</span>
            </div>
          )}

          <div className="flex items-center justify-center text-[10px] text-primary font-medium pt-1">
            <ChevronDown className="h-3 w-3 mr-1" /> View full recipe
          </div>
        </div>
      </Card>
    );
  }

  // ── Expanded Card ──
  return (
    <div className="animate-scale-in">
      <Card className="overflow-hidden rounded-2xl shadow-xl border">
        {/* Hero Image */}
        <div className="relative h-56 md:h-72 overflow-hidden">
          <img
            src={image}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Collapse button */}
          {compact && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-3 right-3 backdrop-blur-sm bg-background/60 hover:bg-background/80"
              onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
            >
              <ChevronUp className="h-4 w-4 mr-1" /> Collapse
            </Button>
          )}

          {/* Title overlay */}
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-2 mb-2">
              {recipe.difficulty && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${diffColor}`}>
                  {recipe.difficulty}
                </span>
              )}
              {recipe.cuisine && (
                <Badge variant="outline" className="text-xs bg-background/60 backdrop-blur-sm border-white/30 text-white">
                  <Globe className="h-3 w-3 mr-1" /> {recipe.cuisine}
                </Badge>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{recipe.name}</h2>
          </div>
        </div>

        <div className="p-5 md:p-8 space-y-6">
          {/* Confidence */}
          {recipe.confidence && (
            <div className="space-y-1 max-w-md">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">AI Match Confidence</span>
                <span className="font-bold text-primary">{recipe.confidence}%</span>
              </div>
              <Progress value={recipe.confidence} className="h-2" />
            </div>
          )}

          {/* Quick Stats Bar */}
          <div className="flex flex-wrap gap-4 p-3 rounded-xl bg-muted/50">
            {recipe.prepTime && (
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-primary" />
                <div><span className="text-muted-foreground text-xs">Prep</span><p className="font-semibold text-xs">{recipe.prepTime}</p></div>
              </div>
            )}
            {recipe.cookTime && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <div><span className="text-muted-foreground text-xs">Cook</span><p className="font-semibold text-xs">{recipe.cookTime}</p></div>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                <div><span className="text-muted-foreground text-xs">Serves</span><p className="font-semibold text-xs">{recipe.servings}</p></div>
              </div>
            )}
            {recipe.calories && (
              <div className="flex items-center gap-2 text-sm">
                <Flame className="h-4 w-4 text-primary" />
                <div><span className="text-muted-foreground text-xs">Calories</span><p className="font-semibold text-xs">{recipe.calories} cal</p></div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy}>
              <Copy className="h-3.5 w-3.5 mr-1.5" />Copy
            </Button>
            {showActions && onAddToMealPlan && (
              <Button size="sm" variant="outline" onClick={onAddToMealPlan}>
                <Calendar className="h-3.5 w-3.5 mr-1.5" />Meal Plan
              </Button>
            )}
            {showActions && onShare && (
              <Button size="sm" variant="outline" onClick={onShare}>
                <Share2 className="h-3.5 w-3.5 mr-1.5" />Share
              </Button>
            )}
            {showActions && onDelete && (
              <Button size="sm" variant="destructive" onClick={onDelete}>
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />Delete
              </Button>
            )}
          </div>

          {/* Ingredients + Instructions */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ingredients */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                🥘 Ingredients
                <span className="text-xs font-normal text-muted-foreground">({recipe.ingredients.length} items)</span>
              </h3>
              <ul className="space-y-1.5">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-primary mt-0.5 font-bold">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cooking Steps */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                👨‍🍳 Cooking Method
                <span className="text-xs font-normal text-muted-foreground">({recipe.instructions.length} steps)</span>
              </h3>
              <ol className="space-y-3">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Chef Tip */}
          {recipe.tips && (
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Pro Chef Tip</h3>
              </div>
              <p className="text-sm text-muted-foreground">{recipe.tips}</p>
            </div>
          )}

          {/* Substitutions */}
          {recipe.substitutions && Object.keys(recipe.substitutions).length > 0 && (
            <div className="p-4 bg-accent/10 rounded-xl">
              <h3 className="text-sm font-semibold mb-2">💡 Substitutions</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(recipe.substitutions).map(([original, substitute]) => (
                  <span key={original} className="text-xs px-2 py-1 bg-background rounded-full border">
                    <span className="font-medium">{original}</span>
                    <span className="text-muted-foreground"> → </span>
                    <span>{substitute}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RecipeCard;
