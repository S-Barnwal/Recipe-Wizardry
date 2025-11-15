import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

const DatasetManagement = () => {
  const [dishes, setDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDish, setNewDish] = useState({
    dish_name: "",
    ingredients: [] as string[],
    image_urls: [""],
  });
  const [ingredientInput, setIngredientInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const { data, error } = await supabase
        .from("dish_images")
        .select("*")
        .order("dish_name");

      if (error) throw error;

      // Group by dish name
      const groupedDishes = data.reduce((acc: any, item: any) => {
        const dishName = item.dish_name;
        if (!acc[dishName]) {
          acc[dishName] = {
            dish_name: dishName,
            ingredients: item.ingredients,
            images: [],
          };
        }
        acc[dishName].images.push({ id: item.id, url: item.image_url });
        return acc;
      }, {});

      setDishes(Object.values(groupedDishes));
    } catch (error: any) {
      toast({
        title: "Error loading dishes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddImageUrl = () => {
    setNewDish({ ...newDish, image_urls: [...newDish.image_urls, ""] });
  };

  const handleUpdateImageUrl = (index: number, value: string) => {
    const updated = [...newDish.image_urls];
    updated[index] = value;
    setNewDish({ ...newDish, image_urls: updated });
  };

  const handleRemoveImageUrl = (index: number) => {
    const updated = newDish.image_urls.filter((_, i) => i !== index);
    setNewDish({ ...newDish, image_urls: updated });
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setNewDish({
        ...newDish,
        ingredients: [...newDish.ingredients, ingredientInput.trim()],
      });
      setIngredientInput("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const updated = newDish.ingredients.filter((_, i) => i !== index);
    setNewDish({ ...newDish, ingredients: updated });
  };

  const handleAddDish = async () => {
    if (!newDish.dish_name.trim() || newDish.ingredients.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please provide dish name and at least one ingredient",
        variant: "destructive",
      });
      return;
    }

    const validUrls = newDish.image_urls.filter((url) => url.trim());
    if (validUrls.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please provide at least one image URL",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const totalImages = validUrls.length;
      for (let i = 0; i < totalImages; i++) {
        const { error } = await supabase.from("dish_images").insert({
          dish_name: newDish.dish_name,
          image_url: validUrls[i],
          ingredients: newDish.ingredients,
        });

        if (error) throw error;
        setUploadProgress(((i + 1) / totalImages) * 100);
      }

      toast({
        title: "Success",
        description: `Added ${totalImages} images for ${newDish.dish_name}`,
      });

      setNewDish({ dish_name: "", ingredients: [], image_urls: [""] });
      setUploadProgress(0);
      fetchDishes();
    } catch (error: any) {
      toast({
        title: "Error adding dish",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
        title: "Success",
        description: `Deleted ${dishName} and all its images`,
      });
      fetchDishes();
    } catch (error: any) {
      toast({
        title: "Error deleting dish",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-full bg-primary/10">
            <Database className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Dataset Management</h1>
            <p className="text-muted-foreground">
              Manage dish training data and images
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add New Dish */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Dish</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="dish_name">Dish Name</Label>
                <Input
                  id="dish_name"
                  value={newDish.dish_name}
                  onChange={(e) =>
                    setNewDish({ ...newDish, dish_name: e.target.value })
                  }
                  placeholder="e.g., Spaghetti Carbonara"
                />
              </div>

              <div>
                <Label>Ingredients</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddIngredient()}
                    placeholder="Add ingredient"
                  />
                  <Button onClick={handleAddIngredient} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newDish.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full"
                    >
                      <span className="text-sm">{ing}</span>
                      <button
                        onClick={() => handleRemoveIngredient(idx)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Image URLs</Label>
                <div className="space-y-2">
                  {newDish.image_urls.map((url, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) =>
                          handleUpdateImageUrl(idx, e.target.value)
                        }
                        placeholder="https://example.com/image.jpg"
                      />
                      {idx > 0 && (
                        <Button
                          onClick={() => handleRemoveImageUrl(idx)}
                          size="icon"
                          variant="ghost"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    onClick={handleAddImageUrl}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image URL
                  </Button>
                </div>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <Button
                onClick={handleAddDish}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Dish...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Add Dish to Dataset
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Existing Dishes */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              Training Dataset ({dishes.length} dishes)
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {dishes.map((dish, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {dish.dish_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {dish.images.length} images
                        </p>
                      </div>
                      <Button
                        onClick={() => handleDeleteDish(dish.dish_name)}
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {dish.ingredients.map((ing: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs bg-secondary px-2 py-1 rounded-full"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {dish.images.slice(0, 5).map((img: any, i: number) => (
                        <img
                          key={i}
                          src={img.url}
                          alt={dish.dish_name}
                          className="w-full h-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DatasetManagement;
