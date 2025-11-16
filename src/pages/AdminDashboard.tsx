import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Shield,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Search,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dishes, setDishes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newDish, setNewDish] = useState({
    name: "",
    ingredients: [""],
    imageUrls: [""],
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    fetchDishes();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Access Denied",
          description: "Please sign in to access admin dashboard",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      setUser(user);
      setLoading(false);
    } catch (error) {
      navigate("/auth");
    }
  };

  const fetchDishes = async () => {
    try {
      const { data, error } = await supabase
        .from("dish_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Group by dish name
      const grouped = data?.reduce((acc: any, item: any) => {
        if (!acc[item.dish_name]) {
          acc[item.dish_name] = {
            name: item.dish_name,
            ingredients: item.ingredients,
            images: [],
          };
        }
        acc[item.dish_name].images.push({
          id: item.id,
          url: item.image_url,
        });
        return acc;
      }, {});

      setDishes(Object.values(grouped || {}));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddIngredient = () => {
    setNewDish({
      ...newDish,
      ingredients: [...newDish.ingredients, ""],
    });
  };

  const handleAddImageUrl = () => {
    setNewDish({
      ...newDish,
      imageUrls: [...newDish.imageUrls, ""],
    });
  };

  const handleIngredientChange = (index: number, value: string) => {
    const updated = [...newDish.ingredients];
    updated[index] = value;
    setNewDish({ ...newDish, ingredients: updated });
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const updated = [...newDish.imageUrls];
    updated[index] = value;
    setNewDish({ ...newDish, imageUrls: updated });
  };

  const handleAddDish = async () => {
    if (!newDish.name.trim()) {
      toast({
        title: "Error",
        description: "Dish name is required",
        variant: "destructive",
      });
      return;
    }

    const validIngredients = newDish.ingredients.filter((i) => i.trim());
    const validUrls = newDish.imageUrls.filter((u) => u.trim());

    if (validIngredients.length === 0 || validUrls.length === 0) {
      toast({
        title: "Error",
        description: "At least one ingredient and image URL required",
        variant: "destructive",
      });
      return;
    }

    try {
      const insertPromises = validUrls.map((url) =>
        supabase.from("dish_images").insert({
          dish_name: newDish.name.trim(),
          ingredients: validIngredients,
          image_url: url.trim(),
        })
      );

      await Promise.all(insertPromises);

      toast({
        title: "Success",
        description: "Dish added successfully",
      });

      setNewDish({ name: "", ingredients: [""], imageUrls: [""] });
      fetchDishes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteDish = async (dishName: string) => {
    try {
      const { error } = await supabase
        .from("dish_images")
        .delete()
        .eq("dish_name", dishName);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Dish deleted successfully",
      });

      fetchDishes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage dish database and training data
            </p>
          </div>
        </div>

        <Tabs defaultValue="view" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">View Dishes</TabsTrigger>
            <TabsTrigger value="add">Add New Dish</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" onClick={fetchDishes}>
                Refresh
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredDishes.map((dish, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{dish.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {dish.images.length} image(s)
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteDish(dish.name)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Ingredients:</h4>
                    <div className="flex flex-wrap gap-2">
                      {dish.ingredients.map((ing: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-secondary rounded-full text-sm"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Images:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {dish.images.map((img: any) => (
                        <img
                          key={img.id}
                          src={img.url}
                          alt={dish.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              ))}

              {filteredDishes.length === 0 && (
                <Card className="p-12 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No dishes found</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="add">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Add New Dish</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Dish Name *
                  </label>
                  <Input
                    placeholder="e.g., Chicken Biryani"
                    value={newDish.name}
                    onChange={(e) =>
                      setNewDish({ ...newDish, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">
                      Ingredients *
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddIngredient}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {newDish.ingredients.map((ingredient, idx) => (
                    <Input
                      key={idx}
                      placeholder="e.g., Chicken"
                      value={ingredient}
                      onChange={(e) =>
                        handleIngredientChange(idx, e.target.value)
                      }
                      className="mb-2"
                    />
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">
                      Image URLs *
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddImageUrl}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {newDish.imageUrls.map((url, idx) => (
                    <Input
                      key={idx}
                      placeholder="https://example.com/image.jpg"
                      value={url}
                      onChange={(e) =>
                        handleImageUrlChange(idx, e.target.value)
                      }
                      className="mb-2"
                    />
                  ))}
                </div>

                <Button onClick={handleAddDish} className="w-full" size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Dish to Database
                </Button>
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
