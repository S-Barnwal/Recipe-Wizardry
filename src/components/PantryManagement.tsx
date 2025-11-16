import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Plus, X, ChefHat, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PantryItem {
  id: string;
  name: string;
  category: string;
  quantity?: number;
}

const PantryManagement = () => {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    loadPantryItems();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadPantryItems = () => {
    const saved = localStorage.getItem("pantryItems");
    if (saved) {
      setPantryItems(JSON.parse(saved));
    }
  };

  const savePantryItems = (items: PantryItem[]) => {
    localStorage.setItem("pantryItems", JSON.stringify(items));
    setPantryItems(items);
  };

  const handleAddItem = () => {
    if (!newItem.trim()) return;

    const item: PantryItem = {
      id: Date.now().toString(),
      name: newItem.trim(),
      category: "Other",
    };

    savePantryItems([...pantryItems, item]);
    setNewItem("");
    toast({
      title: "Item added",
      description: `${item.name} added to your pantry`,
    });
  };

  const handleRemoveItem = (id: string) => {
    savePantryItems(pantryItems.filter((item) => item.id !== id));
  };

  const handleGenerateRecipes = async () => {
    if (pantryItems.length === 0) {
      toast({
        title: "Empty pantry",
        description: "Add some ingredients first",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate recipes",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const ingredients = pantryItems.map((item) => item.name);
      const { data, error } = await supabase.functions.invoke(
        "generate-recipe-from-ingredients",
        {
          body: { ingredients },
        }
      );

      if (error) throw error;

      toast({
        title: "Recipe generated!",
        description: "Check your recipe results below",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate recipe",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
          <Search className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">My Pantry</h2>
          <p className="text-sm text-muted-foreground">
            Manage your ingredients and get recipe suggestions
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Add Item */}
        <div className="flex gap-2">
          <Input
            placeholder="Add ingredient (e.g., Tomatoes)"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddItem()}
          />
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Pantry Items */}
        {pantryItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">
              Your Ingredients ({pantryItems.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {pantryItems.map((item) => (
                <Badge
                  key={item.id}
                  variant="secondary"
                  className="px-3 py-2 text-sm"
                >
                  {item.name}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerateRecipes}
          disabled={pantryItems.length === 0 || isGenerating}
          className="w-full"
          size="lg"
        >
          <ChefHat className="h-5 w-5 mr-2" />
          {isGenerating
            ? "Generating..."
            : "Generate Recipes from My Pantry"}
        </Button>
      </div>
    </Card>
  );
};

export default PantryManagement;
