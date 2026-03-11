import saladBowl from "@/assets/salad-bowl.jpg";
import grilledChicken from "@/assets/grilled-chicken.jpg";
import asianBowl from "@/assets/asian-bowl.jpg";
import seafoodDish from "@/assets/seafood-dish.jpg";
import dessertChocolate from "@/assets/dessert-chocolate.jpg";
import heroPasta from "@/assets/hero-pasta.jpg";

interface Category {
  title: string;
  subtitle: string;
  image: string;
}

const categories: Category[] = [
  { title: "Fresh & Healthy", subtitle: "Nutritious salads and bowls", image: saladBowl },
  { title: "Grilled Perfection", subtitle: "Smoky and savory grilled dishes", image: grilledChicken },
  { title: "Global Flavors", subtitle: "Explore world cuisines", image: asianBowl },
  { title: "Seafood Delights", subtitle: "Fresh from the ocean", image: seafoodDish },
  { title: "Sweet Endings", subtitle: "Decadent desserts", image: dessertChocolate },
  { title: "Pasta Paradise", subtitle: "Italian pasta perfection", image: heroPasta },
];

interface FoodRecommendationsProps {
  onCategorySelect?: (category: string) => void;
}

const FoodRecommendations = ({ onCategorySelect }: FoodRecommendationsProps) => {
  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">Discover Endless Possibilities</h2>
        <p className="text-muted-foreground">Explore our diverse collection of recipe categories</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, idx) => (
          <div
            key={idx}
            className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={() => onCategorySelect?.(category.title)}
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-xl">{category.title}</h3>
                <p className="text-sm text-white/80">{category.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Emoji Marquee */}
      <div className="mt-10 overflow-hidden">
        <div className="flex gap-8 animate-marquee whitespace-nowrap text-4xl opacity-60">
          {["🍕", "🥑", "🍜", "🧄", "🌶️", "🍋", "🫒", "🥘", "🍕", "🥑", "🍜", "🧄", "🌶️", "🍋", "🫒", "🥘"].map((emoji, i) => (
            <span key={i} className="inline-block">{emoji}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodRecommendations;
