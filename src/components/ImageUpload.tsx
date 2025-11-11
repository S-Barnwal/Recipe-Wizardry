import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Upload, Image as ImageIcon, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onGenerate: (file: File) => void;
  isLoading: boolean;
}

const ImageUpload = ({ onGenerate, isLoading }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
    }
  }, []);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  const handleGenerate = () => {
    if (selectedFile) {
      onGenerate(selectedFile);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 shadow-lg hover:shadow-xl transition-smooth">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-secondary/20">
          <ImageIcon className="h-6 w-6 text-secondary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Image Upload</h2>
          <p className="text-sm text-muted-foreground">Upload a dish photo for AI detection</p>
        </div>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-smooth ${
          isDragging
            ? "border-primary bg-primary/5 scale-105"
            : "border-muted hover:border-primary/50"
        }`}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-xl shadow-md"
            />
            <Button
              onClick={handleClear}
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2"
            >
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
              <p className="text-lg font-medium mb-2">Drag & drop your image here</p>
              <p className="text-sm text-muted-foreground">or</p>
            </div>
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>Browse Files</span>
              </Button>
            </label>
          </div>
        )}
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!selectedFile || isLoading}
        className="w-full mt-4 gradient-secondary text-secondary-foreground hover:shadow-glow transition-smooth"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Detecting Dish...
          </>
        ) : (
          <>
            <ImageIcon className="mr-2 h-4 w-4" />
            Detect Dish & Generate Recipe
          </>
        )}
      </Button>

      {preview && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          Image ready for detection
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
