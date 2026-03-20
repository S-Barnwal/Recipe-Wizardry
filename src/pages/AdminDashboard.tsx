import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { isAdminEmail } from "@/lib/adminEmails";
import {
  Shield,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Search,
  Users,
  ChefHat,
  TrendingUp,
  BarChart3,
  Eye,
  Ban,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dishes, setDishes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [communityRecipes, setCommunityRecipes] = useState<any[]>([]);
  const [recipeSearch, setRecipeSearch] = useState("");
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalCommunityRecipes: 0,
    totalLikes: 0,
    totalReviews: 0,
    totalMealPlans: 0,
  });
  const [newDish, setNewDish] = useState({ name: "", ingredients: [""], imageUrls: [""] });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isAdminEmail(user.email)) {
      toast({ title: "Access Denied", description: "You don't have admin privileges.", variant: "destructive" });
      navigate("/");
      return;
    }
    await Promise.all([fetchDishes(), fetchUsers(), fetchCommunityRecipes(), fetchPlatformStats()]);
    setLoading(false);
  };

  const fetchPlatformStats = async () => {
    const [profiles, userRecipes, community, likes, reviews, meals] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact" }),
      supabase.from("user_recipes").select("id", { count: "exact" }),
      supabase.from("community_recipes").select("id, likes_count", { count: "exact" }),
      supabase.from("recipe_likes").select("id", { count: "exact" }),
      supabase.from("recipe_reviews").select("id", { count: "exact" }),
      supabase.from("meal_plans").select("id", { count: "exact" }),
    ]);
    const totalLikes = community.data?.reduce((s, r) => s + (r.likes_count || 0), 0) || 0;
    setPlatformStats({
      totalUsers: profiles.count || 0,
      totalRecipes: userRecipes.count || 0,
      totalCommunityRecipes: community.count || 0,
      totalLikes,
      totalReviews: reviews.count || 0,
      totalMealPlans: meals.count || 0,
    });
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setUsers(data || []);
  };

  const fetchCommunityRecipes = async () => {
    const { data } = await supabase
      .from("community_recipes")
      .select("*")
      .order("created_at", { ascending: false });
    setCommunityRecipes(data || []);
  };

  const fetchDishes = async () => {
    const { data } = await supabase.from("dish_images").select("*").order("created_at", { ascending: false });
    const grouped = data?.reduce((acc: any, item: any) => {
      if (!acc[item.dish_name]) acc[item.dish_name] = { name: item.dish_name, ingredients: item.ingredients, images: [] };
      acc[item.dish_name].images.push({ id: item.id, url: item.image_url });
      return acc;
    }, {});
    setDishes(Object.values(grouped || {}));
  };

  const handleDeleteRecipe = async (id: string) => {
    const { error } = await supabase.from("community_recipes").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Deleted", description: "Recipe removed from community." });
    fetchCommunityRecipes();
    fetchPlatformStats();
  };

  const handleDeleteDish = async (dishName: string) => {
    const { error } = await supabase.from("dish_images").delete().eq("dish_name", dishName);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Deleted", description: "Dish deleted successfully" });
    fetchDishes();
  };

  const handleAddIngredient = () => setNewDish({ ...newDish, ingredients: [...newDish.ingredients, ""] });
  const handleAddImageUrl = () => setNewDish({ ...newDish, imageUrls: [...newDish.imageUrls, ""] });
  const handleIngredientChange = (i: number, v: string) => { const u = [...newDish.ingredients]; u[i] = v; setNewDish({ ...newDish, ingredients: u }); };
  const handleImageUrlChange = (i: number, v: string) => { const u = [...newDish.imageUrls]; u[i] = v; setNewDish({ ...newDish, imageUrls: u }); };

  const handleAddDish = async () => {
    if (!newDish.name.trim()) { toast({ title: "Error", description: "Dish name is required", variant: "destructive" }); return; }
    const validIngredients = newDish.ingredients.filter(i => i.trim());
    const validUrls = newDish.imageUrls.filter(u => u.trim());
    if (!validIngredients.length || !validUrls.length) { toast({ title: "Error", description: "At least one ingredient and image URL required", variant: "destructive" }); return; }
    await Promise.all(validUrls.map(url => supabase.from("dish_images").insert({ dish_name: newDish.name.trim(), ingredients: validIngredients, image_url: url.trim() })));
    toast({ title: "Success", description: "Dish added successfully" });
    setNewDish({ name: "", ingredients: [""], imageUrls: [""] });
    fetchDishes();
  };

  const filteredDishes = dishes.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredUsers = users.filter(u => (u.username || u.id).toLowerCase().includes(userSearch.toLowerCase()));
  const filteredRecipes = communityRecipes.filter(r => r.dish_name.toLowerCase().includes(recipeSearch.toLowerCase()));

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const analytics = [
    { icon: Users, label: "Total Users", value: platformStats.totalUsers, color: "text-blue-600", bg: "bg-blue-50" },
    { icon: ChefHat, label: "User Recipes", value: platformStats.totalRecipes, color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: TrendingUp, label: "Community Recipes", value: platformStats.totalCommunityRecipes, color: "text-amber-600", bg: "bg-amber-50" },
    { icon: BarChart3, label: "Total Likes", value: platformStats.totalLikes, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform management & analytics</p>
          </div>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {analytics.map((s, i) => (
            <Card key={i} className="p-5">
              <div className={`inline-flex p-2.5 rounded-xl ${s.bg} mb-3`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="recipes">Community Recipes</TabsTrigger>
            <TabsTrigger value="dishes">Dish Database</TabsTrigger>
            <TabsTrigger value="add-dish">Add Dish</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="grid gap-3">
              {filteredUsers.map(u => (
                <Card key={u.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {(u.username || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{u.username || "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">Joined {new Date(u.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {u.dietary_preferences?.length > 0 && (
                      <div className="hidden sm:flex gap-1">
                        {u.dietary_preferences.slice(0, 2).map((p: string) => (
                          <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              {filteredUsers.length === 0 && (
                <Card className="p-8 text-center"><Users className="h-10 w-10 mx-auto mb-2 text-muted-foreground" /><p className="text-muted-foreground">No users found</p></Card>
              )}
            </div>
          </TabsContent>

          {/* Community Recipes Tab */}
          <TabsContent value="recipes" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search recipes..." value={recipeSearch} onChange={e => setRecipeSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="grid gap-3">
              {filteredRecipes.map(r => (
                <Card key={r.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{r.dish_name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        {r.cuisine_type && <Badge variant="secondary">{r.cuisine_type}</Badge>}
                        <span>❤️ {r.likes_count || 0}</span>
                        <span>⭐ {Number(r.average_rating || 0).toFixed(1)}</span>
                        <span>📝 {r.review_count || 0} reviews</span>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteRecipe(r.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              {filteredRecipes.length === 0 && (
                <Card className="p-8 text-center"><ChefHat className="h-10 w-10 mx-auto mb-2 text-muted-foreground" /><p className="text-muted-foreground">No recipes found</p></Card>
              )}
            </div>
          </TabsContent>

          {/* Dish Database Tab */}
          <TabsContent value="dishes" className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search dishes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Button variant="outline" onClick={fetchDishes}>Refresh</Button>
            </div>
            <div className="grid gap-4">
              {filteredDishes.map((dish, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{dish.name}</h3>
                      <p className="text-sm text-muted-foreground">{dish.images.length} image(s)</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteDish(dish.name)}>
                      <Trash2 className="h-4 w-4 mr-2" />Delete
                    </Button>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Ingredients:</h4>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(dish.ingredients) ? dish.ingredients : []).map((ing: string, i: number) => (
                        <Badge key={i} variant="secondary">{ing}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {dish.images.map((img: any) => (
                      <img key={img.id} src={img.url} alt={dish.name} className="w-full h-32 object-cover rounded-lg" />
                    ))}
                  </div>
                </Card>
              ))}
              {filteredDishes.length === 0 && (
                <Card className="p-12 text-center"><ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" /><p className="text-muted-foreground">No dishes found</p></Card>
              )}
            </div>
          </TabsContent>

          {/* Add Dish Tab */}
          <TabsContent value="add-dish">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Add New Dish</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Dish Name *</label>
                  <Input placeholder="e.g., Chicken Biryani" value={newDish.name} onChange={e => setNewDish({ ...newDish, name: e.target.value })} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Ingredients *</label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddIngredient}><Plus className="h-4 w-4 mr-1" />Add</Button>
                  </div>
                  {newDish.ingredients.map((ing, idx) => (
                    <Input key={idx} placeholder="e.g., Chicken" value={ing} onChange={e => handleIngredientChange(idx, e.target.value)} className="mb-2" />
                  ))}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Image URLs *</label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddImageUrl}><Plus className="h-4 w-4 mr-1" />Add</Button>
                  </div>
                  {newDish.imageUrls.map((url, idx) => (
                    <Input key={idx} placeholder="https://example.com/image.jpg" value={url} onChange={e => handleImageUrlChange(idx, e.target.value)} className="mb-2" />
                  ))}
                </div>
                <Button onClick={handleAddDish} className="w-full" size="lg"><Plus className="h-5 w-5 mr-2" />Add Dish to Database</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
