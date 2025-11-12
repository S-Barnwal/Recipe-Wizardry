import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock, Users, Flame, Share2, Copy, BookmarkPlus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Recipe {
  name: string;
  confidence?: number;
  ingredients: string[];
  instructions: string[];
  cookTime?: string;
  servings?: number;
  calories?: number;
  substitutions?: { [key: string]: string };
}

interface RecipeCardProps {
  recipe: Recipe;
  onDelete?: () => void;
  onShare?: () => void;
  showActions?: boolean;
}

const RecipeCard = ({ recipe, onDelete, onShare, showActions }: RecipeCardProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    const text = `${recipe.name}\n\nIngredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Recipe has been copied successfully.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Recipe saved!",
      description: "Recipe has been saved to your collection.",
    });
  };

  const handleDefaultShare = () => {
    toast({
      title: "Share feature",
      description: "Share functionality coming soon!",
    });
  };

  return (
    <div className="animate-scale-in">
      <Card className="glass-card rounded-3xl p-8 shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">{recipe.name}</h2>
            {recipe.confidence && (
              <Badge variant="secondary" className="text-sm">
                {recipe.confidence}% Confidence
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {!showActions && (
              <>
                <Button size="icon" variant="outline" onClick={handleSave}>
                  <BookmarkPlus className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={handleDefaultShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button size="icon" variant="outline" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2 mb-4">
            {onShare && (
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share to Community
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-6">
          {recipe.cookTime && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{recipe.cookTime}</span>
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
            <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="text-primary mt-1">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Instructions</h3>
            <ol className="space-y-3">
              {recipe.instructions.map((step, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-sm"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {recipe.substitutions && Object.keys(recipe.substitutions).length > 0 && (
          <div className="mt-6 p-4 bg-accent/10 rounded-xl">
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
