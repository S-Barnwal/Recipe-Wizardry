import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Clock, Users, Flame, Share2, Copy, BookmarkPlus, Trash2, Calendar, ChevronDown, ChevronUp, Lightbulb, Globe, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const RecipeCard = ({ recipe, onDelete, onShare, onAddToMealPlan, showActions, compact }: RecipeCardProps) => {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(!compact);

  const handleCopy = () => {
    const text = `${recipe.name}\n\nIngredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!", description: "Recipe has been copied successfully." });
  };

  const handleSave = () => {
    toast({ title: "Recipe saved!", description: "Recipe has been saved to your collection." });
  };

  const difficultyColor = recipe.difficulty === "Easy" ? "text-green-600 bg-green-100" : recipe.difficulty === "Medium" ? "text-yellow-600 bg-yellow-100" : "text-red-600 bg-red-100";

  if (compact && !expanded) {
    return (
      <Card className="p-4 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/30" onClick={() => setExpanded(true)}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-sm truncate">{recipe.name}</h3>
              {recipe.difficulty && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${difficultyColor}`}>
                  {recipe.difficulty}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {recipe.cuisine && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{recipe.cuisine}</span>}
              {recipe.cookTime && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{recipe.cookTime}</span>}
              {recipe.calories && <span className="flex items-center gap-1"><Flame className="h-3 w-3" />{recipe.calories} cal</span>}
              {recipe.servings && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{recipe.servings}</span>}
            </div>
            {recipe.confidence && (
              <div className="mt-2">
                <Progress value={recipe.confidence} className="h-1.5" />
                <span className="text-[10px] text-muted-foreground">{recipe.confidence}% match</span>
              </div>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
        </div>
      </Card>
    );
  }

  return (
    <div className="animate-scale-in">
      <Card className="glass-card rounded-3xl p-8 shadow-xl">
        {compact && (
          <Button variant="ghost" size="sm" className="mb-2" onClick={() => setExpanded(false)}>
            <ChevronUp className="h-4 w-4 mr-1" /> Collapse
          </Button>
        )}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold">{recipe.name}</h2>
              {recipe.difficulty && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColor}`}>
                  {recipe.difficulty}
                </span>
              )}
              {recipe.cuisine && (
                <Badge variant="outline" className="text-xs">
                  <Globe className="h-3 w-3 mr-1" /> {recipe.cuisine}
                </Badge>
              )}
            </div>
            {recipe.confidence && (
              <div className="space-y-2 mt-3 max-w-md">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">AI Detection Confidence</span>
                  <span className="font-bold text-primary">{recipe.confidence.toFixed(1)}%</span>
                </div>
                <Progress value={recipe.confidence} className="h-2" />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {!showActions && (
              <>
                <Button size="icon" variant="outline" onClick={handleSave}><BookmarkPlus className="h-4 w-4" /></Button>
                <Button size="icon" variant="outline" onClick={handleCopy}><Copy className="h-4 w-4" /></Button>
              </>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex flex-wrap gap-2 mb-4">
            {onAddToMealPlan && <Button variant="outline" size="sm" onClick={onAddToMealPlan}><Calendar className="h-4 w-4 mr-2" />Add to Meal Plan</Button>}
            {onShare && <Button variant="outline" size="sm" onClick={onShare}><Share2 className="h-4 w-4 mr-2" />Share</Button>}
            {onDelete && <Button variant="destructive" size="sm" onClick={onDelete}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>}
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-6">
          {recipe.prepTime && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm">Prep: {recipe.prepTime}</span>
            </div>
          )}
          {recipe.cookTime && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Cook: {recipe.cookTime}</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm">{recipe.servings} servings</span>
            </div>
          )}
          {recipe.calories && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Flame className="h-4 w-4" />
              <span className="text-sm">{recipe.calories} cal</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">🥘 Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-1">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">👨‍🍳 Cooking Method</h3>
            <ol className="space-y-3">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {recipe.tips && (
          <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Pro Chef Tip</h3>
            </div>
            <p className="text-sm text-muted-foreground">{recipe.tips}</p>
          </div>
        )}

        {recipe.substitutions && Object.keys(recipe.substitutions).length > 0 && (
          <div className="mt-4 p-4 bg-accent/10 rounded-xl">
            <h3 className="text-lg font-semibold mb-3">💡 Ingredient Substitutions</h3>
            <div className="grid gap-2">
              {Object.entries(recipe.substitutions).map(([original, substitute]) => (
                <div key={original} className="text-sm">
                  <span className="font-medium">{original}</span>
                  <span className="text-muted-foreground"> → </span>
                  <span className="text-accent-foreground">{substitute}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RecipeCard;