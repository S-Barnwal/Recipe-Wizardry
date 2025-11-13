import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, User, ChefHat, Calendar, Heart } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ recipes: 0, sharedRecipes: 0, totalLikes: 0 });
  
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [newPreference, setNewPreference] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    await fetchProfile(user.id);
    await fetchStats(user.id);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      setProfile(data);
      setUsername(data.username || "");
      setBio(data.bio || "");
      setDietaryPreferences(data.dietary_preferences || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (userId: string) => {
    try {
      const [userRecipes, communityRecipes, likesData] = await Promise.all([
        supabase.from("user_recipes").select("id", { count: "exact" }).eq("user_id", userId),
        supabase.from("community_recipes").select("id", { count: "exact" }).eq("user_id", userId),
        supabase.from("community_recipes").select("likes_count").eq("user_id", userId),
      ]);

      const totalLikes = likesData.data?.reduce((sum, recipe) => sum + (recipe.likes_count || 0), 0) || 0;

      setStats({
        recipes: userRecipes.count || 0,
        sharedRecipes: communityRecipes.count || 0,
        totalLikes,
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          bio,
          dietary_preferences: dietaryPreferences,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your profile has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addPreference = () => {
    if (newPreference.trim() && !dietaryPreferences.includes(newPreference.trim())) {
      setDietaryPreferences([...dietaryPreferences, newPreference.trim()]);
      setNewPreference("");
    }
  };

  const removePreference = (pref: string) => {
    setDietaryPreferences(dietaryPreferences.filter(p => p !== pref));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-foreground">My Profile</h1>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 text-center">
              <ChefHat className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold">{stats.recipes}</div>
              <div className="text-sm text-muted-foreground">Saved Recipes</div>
            </Card>
            <Card className="p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold">{stats.sharedRecipes}</div>
              <div className="text-sm text-muted-foreground">Shared Recipes</div>
            </Card>
            <Card className="p-6 text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold">{stats.totalLikes}</div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </Card>
          </div>

          <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{username || "Anonymous Chef"}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Dietary Preferences</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newPreference}
                    onChange={(e) => setNewPreference(e.target.value)}
                    placeholder="Add preference (e.g., Vegan, Gluten-free)"
                    onKeyPress={(e) => e.key === "Enter" && addPreference()}
                  />
                  <Button onClick={addPreference}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dietaryPreferences.map((pref) => (
                    <Badge key={pref} variant="secondary" className="cursor-pointer" onClick={() => removePreference(pref)}>
                      {pref} ✕
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
