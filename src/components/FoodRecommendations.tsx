import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Salad, Flame, Globe, Fish, Cake, Utensils } from "lucide-react";

interface Category {
  title: string;
  subtitle: string;
  icon: any;
  gradient: string;
}

const categories: Category[] = [
  {
    title: "Fresh & Healthy",
    subtitle: "Nutritious salads and bowls",
    icon: Salad,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    title: "Grilled Perfection",
    subtitle: "Smoky and savory grilled dishes",
    icon: Flame,
    gradient: "from-orange-500 to-red-600",
  },
  {
    title: "Global Flavors",
    subtitle: "Explore world cuisines",
    icon: Globe,
    gradient: "from-blue-500 to-purple-600",
  },
  {
    title: "Seafood Delights",
    subtitle: "Fresh from the ocean",
    icon: Fish,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "Sweet Endings",
    subtitle: "Decadent desserts",
    icon: Cake,
    gradient: "from-pink-500 to-rose-600",
  },
  {
    title: "Pasta Paradise",
    subtitle: "Italian pasta perfection",
    icon: Utensils,
    gradient: "from-yellow-500 to-orange-600",
  },
];

interface FoodRecommendationsProps {
  onCategorySelect?: (category: string) => void;
}

const FoodRecommendations = ({ onCategorySelect }: FoodRecommendationsProps) => {
  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3">Discover Popular Categories</h2>
        <p className="text-muted-foreground">Explore delicious recipes by category</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, idx) => {
          const Icon = category.icon;
          return (
            <Card
              key={idx}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
              onClick={() => onCategorySelect?.(category.title)}
            >
              <div className={`h-2 bg-gradient-to-r ${category.gradient}`} />
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient} text-white group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.subtitle}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Explore Recipes
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FoodRecommendations;
