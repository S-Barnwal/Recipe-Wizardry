import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Search, X } from "lucide-react";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  cuisineType: string;
  onCuisineChange: (value: string) => void;
  dietaryFilters: string[];
  onDietaryFilterToggle: (filter: string) => void;
}

const CUISINE_TYPES = [
  "All",
  "Italian",
  "Mexican",
  "Indian",
  "Chinese",
  "Japanese",
  "Thai",
  "Mediterranean",
  "American",
  "French",
];

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Low-Carb",
];

const SearchFilters = ({
  searchQuery,
  onSearchChange,
  cuisineType,
  onCuisineChange,
  dietaryFilters,
  onDietaryFilterToggle,
}: SearchFiltersProps) => {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={cuisineType} onValueChange={onCuisineChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Cuisine Type" />
          </SelectTrigger>
          <SelectContent>
            {CUISINE_TYPES.map((cuisine) => (
              <SelectItem key={cuisine} value={cuisine}>
                {cuisine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Dietary Restrictions:</p>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((option) => (
            <Badge
              key={option}
              variant={dietaryFilters.includes(option) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onDietaryFilterToggle(option)}
            >
              {option}
              {dietaryFilters.includes(option) && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
