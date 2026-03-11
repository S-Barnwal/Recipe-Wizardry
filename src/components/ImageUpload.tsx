import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Upload, Image as ImageIcon, Loader2, X, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import VoiceInput from "./VoiceInput";

interface ImageUploadProps {
  onGenerate: (file: File) => void;
  onDishNameGenerate?: (dishName: string) => void;
  isLoading: boolean;
  similarImages?: { image_url: string; dish_name: string; ingredients: string[] }[];
}

const ImageUpload = ({ onGenerate, onDishNameGenerate, isLoading, similarImages }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dishNameInput, setDishNameInput] = useState("");
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    } else {
      toast({ title: "Invalid file type", description: "Please upload an image file", variant: "destructive" });
    }
  }, []);

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please upload an image under 5MB", variant: "destructive" });
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  const handleGenerate = () => {
    if (selectedFile) onGenerate(selectedFile);
  };

  const handleVoiceTranscript = (text: string) => {
    setDishNameInput(text.trim());
  };

  return (
    <div>
      <div className="glass-card rounded-3xl p-8 shadow-lg hover:shadow-xl transition-smooth">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-secondary/20">
            <Camera className="h-6 w-6 text-secondary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">📸 Dish Detection</h2>
            <p className="text-sm text-muted-foreground">Upload a photo, type or speak a dish name</p>
          </div>
        </div>

        {/* Image Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-smooth mb-4 ${
            isDragging ? "border-primary bg-primary/5 scale-105" : "border-muted hover:border-primary/50"
          }`}
        >
          {preview ? (
            <div className="relative">
              <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl shadow-md" />
              <Button onClick={handleClear} size="icon" variant="destructive" className="absolute top-2 right-2">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-6 rounded-full bg-muted">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <div>
                <p className="text-lg font-medium mb-1">Upload a dish image</p>
                <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
              </div>
              <label>
                <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
            </div>
          )}
        </div>

        {/* Dish Name Input */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Or type a dish name (e.g., Butter Chicken)..."
            value={dishNameInput}
            onChange={(e) => setDishNameInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && dishNameInput.trim() && onDishNameGenerate) {
                onDishNameGenerate(dishNameInput.trim());
              }
            }}
          />
          <VoiceInput onTranscript={handleVoiceTranscript} />
        </div>

        {/* Action Button */}
        <Button
          onClick={() => {
            if (selectedFile) {
              handleGenerate();
            } else if (dishNameInput.trim() && onDishNameGenerate) {
              onDishNameGenerate(dishNameInput.trim());
            }
          }}
          disabled={(!selectedFile && !dishNameInput.trim()) || isLoading}
          className="w-full gradient-secondary text-secondary-foreground hover:shadow-glow transition-smooth"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Analyze Dish
            </>
          )}
        </Button>
      </div>

      {similarImages && similarImages.length > 0 && (
        <div className="glass-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition-smooth mt-6">
          <h3 className="text-xl font-semibold mb-4">Similar Dishes in Database</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {similarImages.map((img, idx) => (
              <div key={idx} className="space-y-2">
                <img src={img.image_url} alt={img.dish_name} className="w-full h-32 object-cover rounded-lg" />
                <p className="text-sm font-medium text-center">{img.dish_name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
