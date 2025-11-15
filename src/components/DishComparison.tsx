import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X, Scale } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  cookTime?: number;
  prepTime?: number;
  servings?: number;
  calories?: number;
  confidence?: number;
}

interface DishComparisonProps {
  recipes: Recipe[];
  trigger?: React.ReactNode;
}

const DishComparison = ({ recipes, trigger }: DishComparisonProps) => {
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [open, setOpen] = useState(false);

  const handleAddToCompare = (recipe: Recipe) => {
    if (selectedRecipes.length < 3 && !selectedRecipes.includes(recipe)) {
      setSelectedRecipes([...selectedRecipes, recipe]);
    }
  };

  const handleRemoveFromCompare = (recipe: Recipe) => {
    setSelectedRecipes(selectedRecipes.filter((r) => r !== recipe));
  };

  const formatTime = (minutes?: number) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Scale className="mr-2 h-4 w-4" />
            Compare Dishes
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            Dish Comparison
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipe Selector */}
          {selectedRecipes.length < 3 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Select up to 3 dishes to compare:
              </p>
              <div className="flex flex-wrap gap-2">
                {recipes
                  .filter((r) => !selectedRecipes.includes(r))
                  .map((recipe, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToCompare(recipe)}
                    >
                      {recipe.name}
                    </Button>
                  ))}
              </div>
            </div>
          )}

          {/* Comparison Table */}
          {selectedRecipes.length > 0 && (
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedRecipes.length}, 1fr)` }}>
              {selectedRecipes.map((recipe, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">{recipe.name}</h3>
                    <Button
                      onClick={() => handleRemoveFromCompare(recipe)}
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Nutritional Info */}
                  <div className="space-y-3 mb-4">
                    <div className="bg-secondary/20 rounded-lg p-3">
                      <h4 className="font-semibold text-sm mb-2">
                        Nutritional Info
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Calories:
                          </span>
                          <p className="font-semibold">
                            {recipe.calories || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Servings:
                          </span>
                          <p className="font-semibold">
                            {recipe.servings || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Time Info */}
                    <div className="bg-accent/10 rounded-lg p-3">
                      <h4 className="font-semibold text-sm mb-2">Time</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Prep:</span>
                          <p className="font-semibold">
                            {formatTime(recipe.prepTime)}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cook:</span>
                          <p className="font-semibold">
                            {formatTime(recipe.cookTime)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Confidence Score */}
                    {recipe.confidence && (
                      <div className="bg-primary/10 rounded-lg p-3">
                        <h4 className="font-semibold text-sm mb-1">
                          AI Confidence
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2 transition-all"
                              style={{ width: `${recipe.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold">
                            {recipe.confidence}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ingredients */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">
                      Ingredients ({recipe.ingredients.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 8).map((ing, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {ing}
                        </Badge>
                      ))}
                      {recipe.ingredients.length > 8 && (
                        <Badge variant="outline" className="text-xs">
                          +{recipe.ingredients.length - 8} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Steps Count */}
                  <div className="text-sm">
                    <span className="text-muted-foreground">Steps:</span>
                    <span className="font-semibold ml-2">
                      {recipe.instructions.length}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {selectedRecipes.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Scale className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Select dishes above to start comparing</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DishComparison;
