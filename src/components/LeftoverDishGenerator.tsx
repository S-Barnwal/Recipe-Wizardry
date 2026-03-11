import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Loader2, X, Recycle } from "lucide-react";
import VoiceInput from "./VoiceInput";

interface LeftoverDishGeneratorProps {
  onGenerate: (ingredients: string[]) => void;
  isLoading: boolean;
}

const leftoverCategories: { label: string; emoji: string; items: string[] }[] = [
  { label: "Rice & Grains", emoji: "🍚", items: ["Leftover Rice", "Fried Rice", "Cooked Quinoa", "Cooked Oats", "Cooked Biryani"] },
  { label: "Breads & Rotis", emoji: "🫓", items: ["Leftover Roti", "Stale Bread", "Leftover Naan", "Leftover Paratha", "Leftover Pita"] },
  { label: "Cooked Chicken", emoji: "🍗", items: ["Shredded Chicken", "Grilled Chicken", "Chicken Curry", "Tandoori Chicken", "Roast Chicken"] },
  { label: "Cooked Mutton & Lamb", emoji: "🥩", items: ["Mutton Curry", "Lamb Shanks", "Kebab Leftovers", "Cooked Mutton Pieces"] },
  { label: "Cooked Seafood", emoji: "🐟", items: ["Cooked Fish", "Leftover Shrimp", "Fish Curry", "Grilled Salmon", "Fish Fry"] },
  { label: "Egg Dishes", emoji: "🥚", items: ["Boiled Eggs", "Scrambled Eggs", "Omelette", "Egg Curry"] },
  { label: "Paneer & Cheese Dishes", emoji: "🧀", items: ["Paneer Curry", "Leftover Paneer", "Cheese Slices", "Cottage Cheese"] },
  { label: "Cooked Dal & Lentils", emoji: "🥘", items: ["Dal Tadka", "Sambar", "Cooked Lentils", "Rajma Curry", "Chole"] },
  { label: "Cooked Vegetables", emoji: "🥬", items: ["Mixed Veggies", "Aloo Sabzi", "Bhindi", "Gobi", "Palak", "Baingan"] },
  { label: "Cooked Pasta & Noodles", emoji: "🍝", items: ["Leftover Pasta", "Cooked Noodles", "Mac and Cheese", "Spaghetti"] },
  { label: "Cooked Pork & Beef", emoji: "🍖", items: ["Pulled Pork", "Beef Stew", "Cooked Steak", "Meatballs", "Ground Meat"] },
  { label: "Cooked Salads & Sides", emoji: "🥗", items: ["Coleslaw", "Potato Salad", "Corn Salad", "Bean Salad"] },
  { label: "Cooked Soups & Gravies", emoji: "🍲", items: ["Tomato Soup", "Chicken Soup", "Leftover Gravy", "Dal Soup"] },
  { label: "Cooked Snacks & Appetizers", emoji: "🥟", items: ["Samosas", "Pakoras", "Spring Rolls", "Cutlets", "Kebabs"] },
  { label: "Cooked Curries & Gravies", emoji: "🍛", items: ["Butter Chicken", "Korma", "Thai Curry", "Tikka Masala"] },
  { label: "Cooked Stews & Casseroles", emoji: "🫕", items: ["Beef Stew", "Vegetable Casserole", "Chili", "Pot Roast"] },
  { label: "Cooked Mexican & Tex-Mex", emoji: "🌮", items: ["Taco Meat", "Burrito Filling", "Leftover Guacamole", "Refried Beans"] },
  { label: "Cooked Asian Dishes", emoji: "🍣", items: ["Stir Fry", "Teriyaki", "Kung Pao", "Sweet & Sour", "Fried Rice"] },
  { label: "Cooked Desserts & Sweets", emoji: "🥧", items: ["Cake Crumbs", "Leftover Kheer", "Brownie Pieces", "Halwa"] },
  { label: "Cooked Sauces & Condiments", emoji: "🫙", items: ["Tomato Sauce", "Pesto", "Alfredo Sauce", "Chutney", "Salsa"] },
  { label: "Cooked Legumes & Beans", emoji: "🧆", items: ["Falafel", "Hummus", "Baked Beans", "Lentil Soup"] },
  { label: "Cooked Breakfast Items", emoji: "🍳", items: ["Leftover Pancakes", "French Toast", "Waffles", "Hash Browns", "Dosa"] },
];

const LeftoverDishGenerator = ({ onGenerate, isLoading }: LeftoverDishGeneratorProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const toggleItem = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleVoiceTranscript = (text: string) => {
    const newItems = text.split(",").map(i => i.trim()).filter(i => i);
    setSelectedItems([...new Set([...selectedItems, ...newItems])]);
  };

  const displayCategories = activeCategory === "All"
    ? leftoverCategories
    : leftoverCategories.filter(c => c.label === activeCategory);

  return (
    <div className="glass-card rounded-3xl p-8 shadow-lg hover:shadow-xl transition-smooth">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-accent/20">
          <Recycle className="h-6 w-6 text-accent-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">♻️ Leftover Dish Generator</h2>
          <p className="text-sm text-muted-foreground">Turn your leftovers into new delicious dishes</p>
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
        {leftoverCategories.map((cat) => (
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

      {/* Clickable Leftover Items */}
      <div className="max-h-64 overflow-y-auto mb-6 space-y-4">
        {displayCategories.map((cat) => (
          <div key={cat.label}>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">{cat.emoji} {cat.label}</h4>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => {
                const isSelected = selectedItems.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleItem(item)}
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

      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-xl min-h-[60px] mb-4">
          {selectedItems.map((item) => (
            <Badge key={item} variant="secondary" className="px-3 py-2 text-sm flex items-center gap-2 transition-bounce hover:scale-105">
              {item}
              <button onClick={() => toggleItem(item)} className="hover:text-destructive transition-smooth">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1">
          <VoiceInput onTranscript={handleVoiceTranscript} />
        </div>
        <Button
          onClick={() => onGenerate(selectedItems)}
          disabled={selectedItems.length === 0 || isLoading}
          className="flex-[4] gradient-primary text-primary-foreground hover:shadow-glow transition-smooth"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Leftover Recipe...
            </>
          ) : (
            <>
              <Recycle className="mr-2 h-4 w-4" />
              Generate from Leftovers ({selectedItems.length})
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LeftoverDishGenerator;
