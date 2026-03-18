import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, ChefHat, AlertTriangle, Leaf, X } from "lucide-react";

const DIETARY_OPTIONS = [
  { label: "Vegetarian", icon: "🥬" },
  { label: "Vegan", icon: "🌱" },
  { label: "Gluten-Free", icon: "🌾" },
  { label: "Dairy-Free", icon: "🥛" },
  { label: "Keto", icon: "🥑" },
  { label: "Paleo", icon: "🍖" },
  { label: "Low-Carb", icon: "📉" },
  { label: "Halal", icon: "☪️" },
  { label: "Kosher", icon: "✡️" },
  { label: "Pescatarian", icon: "🐟" },
];

const COMMON_ALLERGIES = [
  "Peanuts", "Tree Nuts", "Milk", "Eggs", "Wheat",
  "Soy", "Fish", "Shellfish", "Sesame",
];

const CUISINE_PREFERENCES = [
  { label: "Indian", icon: "🇮🇳" },
  { label: "Italian", icon: "🇮🇹" },
  { label: "Mexican", icon: "🇲🇽" },
  { label: "Chinese", icon: "🇨🇳" },
  { label: "Japanese", icon: "🇯🇵" },
  { label: "Thai", icon: "🇹🇭" },
  { label: "Mediterranean", icon: "🫒" },
  { label: "American", icon: "🇺🇸" },
  { label: "French", icon: "🇫🇷" },
  { label: "Korean", icon: "🇰🇷" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [customAllergy, setCustomAllergy] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      // Check if already onboarded
      const { data: profile } = await supabase
        .from("profiles")
        .select("dietary_preferences")
        .eq("id", user.id)
        .single();
      if (profile?.dietary_preferences && profile.dietary_preferences.length > 0) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  const toggleItem = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const addCustomAllergy = () => {
    const trimmed = customAllergy.trim();
    if (trimmed && !selectedAllergies.includes(trimmed)) {
      setSelectedAllergies(prev => [...prev, trimmed]);
      setCustomAllergy("");
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const preferences = [
        ...selectedDiet.map(d => `diet:${d}`),
        ...selectedAllergies.map(a => `allergy:${a}`),
        ...selectedCuisines.map(c => `cuisine:${c}`),
      ];

      // If user skipped everything, add a marker so we don't show onboarding again
      const finalPrefs = preferences.length > 0 ? preferences : ["onboarded"];

      const { error } = await supabase
        .from("profiles")
        .update({ dietary_preferences: finalPrefs })
        .eq("id", user.id);

      if (error) throw error;

      toast({ title: "🎉 Profile set up!", description: "Your preferences have been saved." });
      navigate("/");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {step === 1 && <Leaf className="h-12 w-12 text-primary" />}
              {step === 2 && <AlertTriangle className="h-12 w-12 text-orange-500" />}
              {step === 3 && <ChefHat className="h-12 w-12 text-primary" />}
            </div>
            <CardTitle className="text-2xl">
              {step === 1 && "What's your dietary preference?"}
              {step === 2 && "Any food allergies?"}
              {step === 3 && "Favorite cuisines?"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Select all that apply — we'll personalize your recipe experience"}
              {step === 2 && "Help us keep you safe by listing any food allergies"}
              {step === 3 && "Pick cuisines you love — we'll recommend matching recipes"}
            </CardDescription>
            {/* Progress bar */}
            <div className="flex gap-2 justify-center mt-4">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-2 w-16 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="flex flex-wrap gap-3 justify-center">
                {DIETARY_OPTIONS.map(opt => (
                  <Badge
                    key={opt.label}
                    variant={selectedDiet.includes(opt.label) ? "default" : "outline"}
                    className="cursor-pointer text-sm py-2 px-4 hover:scale-105 transition-transform"
                    onClick={() => toggleItem(opt.label, selectedDiet, setSelectedDiet)}
                  >
                    {opt.icon} {opt.label}
                    {selectedDiet.includes(opt.label) && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3 justify-center">
                  {COMMON_ALLERGIES.map(allergy => (
                    <Badge
                      key={allergy}
                      variant={selectedAllergies.includes(allergy) ? "destructive" : "outline"}
                      className="cursor-pointer text-sm py-2 px-4 hover:scale-105 transition-transform"
                      onClick={() => toggleItem(allergy, selectedAllergies, setSelectedAllergies)}
                    >
                      {allergy}
                      {selectedAllergies.includes(allergy) && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 max-w-sm mx-auto">
                  <Input
                    placeholder="Add custom allergy..."
                    value={customAllergy}
                    onChange={(e) => setCustomAllergy(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomAllergy())}
                  />
                  <Button variant="outline" onClick={addCustomAllergy} disabled={!customAllergy.trim()}>
                    Add
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-wrap gap-3 justify-center">
                {CUISINE_PREFERENCES.map(cuisine => (
                  <Badge
                    key={cuisine.label}
                    variant={selectedCuisines.includes(cuisine.label) ? "default" : "outline"}
                    className="cursor-pointer text-sm py-2 px-4 hover:scale-105 transition-transform"
                    onClick={() => toggleItem(cuisine.label, selectedCuisines, setSelectedCuisines)}
                  >
                    {cuisine.icon} {cuisine.label}
                    {selectedCuisines.includes(cuisine.label) && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 ? (
                <Button variant="ghost" onClick={() => setStep(s => s - 1)}>Back</Button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleFinish}>Skip All</Button>
                {step < 3 ? (
                  <Button onClick={() => setStep(s => s + 1)}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleFinish} disabled={saving}>
                    {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Get Started 🚀"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Onboarding;
