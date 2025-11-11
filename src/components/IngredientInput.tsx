import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ChefHat, Plus, X, Loader2 } from "lucide-react";

interface IngredientInputProps {
  onGenerate: (ingredients: string[]) => void;
  isLoading: boolean;
}

const IngredientInput = ({ onGenerate, isLoading }: IngredientInputProps) => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");

  const addIngredient = () => {
    if (currentInput.trim() && !ingredients.includes(currentInput.trim())) {
      setIngredients([...ingredients, currentInput.trim()]);
      setCurrentInput("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  };

  const handleGenerate = () => {
    if (ingredients.length > 0) {
      onGenerate(ingredients);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 shadow-lg hover:shadow-xl transition-smooth">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-primary/10">
          <ChefHat className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Ingredient Input</h2>
          <p className="text-sm text-muted-foreground">Add your available ingredients</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter an ingredient (e.g., tomato, chicken, rice)..."
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={addIngredient}
            size="icon"
            variant="outline"
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-xl min-h-[80px]">
            {ingredients.map((ingredient) => (
              <Badge
                key={ingredient}
                variant="secondary"
                className="px-3 py-2 text-sm flex items-center gap-2 transition-bounce hover:scale-105"
              >
                {ingredient}
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="hover:text-destructive transition-smooth"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={ingredients.length === 0 || isLoading}
          className="w-full gradient-primary text-primary-foreground hover:shadow-glow transition-smooth"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Recipe...
            </>
          ) : (
            <>
              <ChefHat className="mr-2 h-4 w-4" />
              Generate Recipe
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Added {ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default IngredientInput;
