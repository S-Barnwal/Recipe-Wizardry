import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ChefHat, Plus, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import VoiceInput from "./VoiceInput";

interface IngredientInputProps {
  onGenerate: (ingredients: string[]) => void;
  isLoading: boolean;
}

const ingredientCategories: { label: string; emoji: string; items: string[] }[] = [
  { label: "Vegetables", emoji: "🥬", items: ["Tomato", "Onion", "Garlic", "Potato", "Carrot", "Bell Pepper", "Spinach", "Broccoli", "Cauliflower", "Cucumber", "Mushroom", "Eggplant", "Zucchini", "Cabbage", "Peas"] },
  { label: "Herbs & Aromatics", emoji: "🌿", items: ["Basil", "Cilantro", "Parsley", "Mint", "Rosemary", "Thyme", "Oregano", "Dill", "Lemongrass", "Bay Leaf", "Ginger", "Green Chili"] },
  { label: "Fruits", emoji: "🍎", items: ["Lemon", "Lime", "Orange", "Mango", "Apple", "Banana", "Pineapple", "Coconut", "Avocado", "Tomato"] },
  { label: "Meat & Poultry", emoji: "🥩", items: ["Chicken", "Chicken Breast", "Chicken Thigh", "Beef", "Lamb", "Pork", "Turkey", "Ground Beef", "Mutton", "Bacon", "Sausage"] },
  { label: "Seafood", emoji: "🐟", items: ["Salmon", "Shrimp", "Tuna", "Cod", "Prawns", "Crab", "Lobster", "Tilapia", "Sardine", "Squid"] },
  { label: "Eggs & Dairy", emoji: "🥚", items: ["Eggs", "Milk", "Butter", "Cheese", "Cream", "Yogurt", "Paneer", "Mozzarella", "Cheddar", "Cream Cheese", "Sour Cream"] },
  { label: "Plant Proteins & Legumes", emoji: "🌱", items: ["Tofu", "Chickpeas", "Lentils", "Black Beans", "Kidney Beans", "Edamame", "Tempeh", "Green Peas", "Soy Chunks"] },
  { label: "Spices", emoji: "🌶️", items: ["Cumin", "Turmeric", "Paprika", "Cinnamon", "Coriander", "Garam Masala", "Chili Powder", "Black Pepper", "Cardamom", "Cloves", "Nutmeg", "Saffron"] },
  { label: "Nuts & Seeds", emoji: "🥜", items: ["Almonds", "Cashews", "Peanuts", "Walnuts", "Sesame Seeds", "Sunflower Seeds", "Pine Nuts", "Chia Seeds", "Flax Seeds"] },
  { label: "Oils, Fats & Vinegars", emoji: "🫒", items: ["Olive Oil", "Vegetable Oil", "Coconut Oil", "Sesame Oil", "Ghee", "Apple Cider Vinegar", "Balsamic Vinegar", "Rice Vinegar"] },
  { label: "Pantry Staples", emoji: "🧂", items: ["Salt", "Sugar", "Flour", "Rice", "Pasta", "Bread", "Cornstarch", "Baking Powder", "Baking Soda", "Honey", "Maple Syrup"] },
  { label: "Sauces & Condiments", emoji: "🥫", items: ["Soy Sauce", "Tomato Sauce", "Hot Sauce", "Ketchup", "Mustard", "Mayonnaise", "Worcestershire", "Fish Sauce", "Oyster Sauce", "Tahini"] },
  { label: "Beverages & Liquids", emoji: "🥤", items: ["Water", "Chicken Stock", "Vegetable Broth", "Coconut Milk", "Wine", "Beer", "Coffee", "Tea"] },
  { label: "Baking & Dessert", emoji: "🧈", items: ["Chocolate", "Cocoa Powder", "Vanilla Extract", "Whipped Cream", "Condensed Milk", "Gelatin", "Food Coloring"] },
  { label: "Grains & Cereals", emoji: "🌾", items: ["Oats", "Quinoa", "Couscous", "Barley", "Bulgur", "Polenta", "Semolina", "Millet"] },
  { label: "Pickled & Preserved", emoji: "🥒", items: ["Pickles", "Olives", "Capers", "Sun-dried Tomatoes", "Kimchi", "Sauerkraut", "Preserved Lemon"] },
  { label: "Breads & Wraps", emoji: "🍞", items: ["Naan", "Tortilla", "Pita Bread", "Baguette", "Roti", "Croissant", "Ciabatta"] },
  { label: "Canned & Packaged", emoji: "🫙", items: ["Canned Tomatoes", "Canned Tuna", "Canned Corn", "Canned Beans", "Coconut Cream", "Tomato Paste"] },
  { label: "Chinese Cuisine", emoji: "🥡", items: ["Bok Choy", "Water Chestnuts", "Bean Sprouts", "Hoisin Sauce", "Star Anise", "Five Spice", "Rice Noodles", "Wonton Wrappers"] },
];

const IngredientInput = ({ onGenerate, isLoading }: IngredientInputProps) => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchIngredients = async () => {
      const { data, error } = await supabase
        .from('ingredients')
        .select('name')
        .order('name');
      
      if (data) {
        setAvailableIngredients(data.map(i => i.name));
      }
    };
    fetchIngredients();
  }, []);

  useEffect(() => {
    if (currentInput.trim()) {
      const filtered = availableIngredients.filter(ing =>
        ing.toLowerCase().includes(currentInput.toLowerCase())
      ).slice(0, 5);
      setFilteredIngredients(filtered);
    } else {
      setFilteredIngredients([]);
    }
  }, [currentInput, availableIngredients]);

  const addIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setCurrentInput("");
      setFilteredIngredients([]);
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredIngredients.length > 0) {
        addIngredient(filteredIngredients[0]);
      } else {
        addIngredient(currentInput);
      }
    }
  };

  const handleVoiceTranscript = (text: string) => {
    const newIngredients = text.split(",").map(i => i.trim()).filter(i => i);
    setIngredients([...new Set([...ingredients, ...newIngredients])]);
  };

  const handleGenerate = () => {
    if (ingredients.length > 0) {
      onGenerate(ingredients);
    }
  };

  const displayCategories = activeCategory === "All"
    ? ingredientCategories
    : ingredientCategories.filter(c => c.label === activeCategory);

  return (
    <div className="glass-card rounded-3xl p-8 shadow-lg hover:shadow-xl transition-smooth">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-primary/10">
          <ChefHat className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">🧑‍🍳 Ingredient Input</h2>
          <p className="text-sm text-muted-foreground">Type, click or speak to add ingredients</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory("All")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-smooth ${
            activeCategory === "All"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All
        </button>
        {ingredientCategories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(cat.label === activeCategory ? "All" : cat.label)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-smooth ${
              activeCategory === cat.label
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Clickable Ingredient Grid */}
      <div className="max-h-64 overflow-y-auto mb-6 space-y-4">
        {displayCategories.map((cat) => (
          <div key={cat.label}>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">{cat.emoji} {cat.label}</h4>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => {
                const isSelected = ingredients.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => isSelected ? removeIngredient(item) : addIngredient(item)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-smooth ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-foreground hover:bg-primary/10"
                    }`}
                  >
                    {item} {isSelected && "✓"}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Text Input + Voice */}
      <div className="space-y-4">
        <div className="relative">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                placeholder="Type an ingredient..."
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full"
              />
              {filteredIngredients.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-card border rounded-lg shadow-lg">
                  {filteredIngredients.map((ing) => (
                    <button
                      key={ing}
                      onClick={() => addIngredient(ing)}
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-smooth text-sm"
                    >
                      {ing}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={() => addIngredient(currentInput)} size="icon" variant="outline" className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
            <VoiceInput onTranscript={handleVoiceTranscript} />
          </div>
        </div>

        {/* Selected Ingredients */}
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-xl min-h-[60px]">
            {ingredients.map((ingredient) => (
              <Badge key={ingredient} variant="secondary" className="px-3 py-2 text-sm flex items-center gap-2 transition-bounce hover:scale-105">
                {ingredient}
                <button onClick={() => removeIngredient(ingredient)} className="hover:text-destructive transition-smooth">
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
              Find Recipes ({ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""})
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default IngredientInput;
