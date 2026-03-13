import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Upload, Loader2, X, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "./ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface BulkImageUploadProps {
  onComplete?: () => void;
}

interface UploadStatus {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  message?: string;
  preview?: string;
  detectedDish?: string;
}

const BulkImageUpload = ({ onComplete }: BulkImageUploadProps) => {
  const [files, setFiles] = useState<UploadStatus[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const imageFiles = selectedFiles.filter((f) => f.type.startsWith("image/"));

    if (imageFiles.length !== selectedFiles.length) {
      toast({
        title: "Invalid files",
        description: "Some files were skipped. Only images are allowed.",
        variant: "destructive",
      });
    }

    const newFiles: UploadStatus[] = imageFiles.map((file) => ({
      file,
      status: "pending",
      preview: URL.createObjectURL(file),
    }));

    setFiles([...files, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
  };

  const handleBulkUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    const totalFiles = files.length;
    const updatedFiles = [...files];
    const generatedRecipes: any[] = [];

    for (let i = 0; i < totalFiles; i++) {
      updatedFiles[i].status = "uploading";
      setFiles([...updatedFiles]);

      try {
        // Convert to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(updatedFiles[i].file);
        });

        const imageBase64 = await base64Promise;

        // Detect dish and generate recipe
        const { data, error } = await supabase.functions.invoke(
          "detect-dish-from-image",
          {
            body: { imageBase64 },
          }
        );

        if (error) {
          updatedFiles[i].status = "error";
          updatedFiles[i].message = error.message || "Detection failed";
        } else if (data?.error === "not_food") {
          updatedFiles[i].status = "error";
          updatedFiles[i].message = data?.message || "😂 Not food!";
        } else if (data?.recipe) {
          updatedFiles[i].status = "success";
          updatedFiles[i].detectedDish = data.recipe.name;
          updatedFiles[i].message = `✓ ${data.recipe.name}`;
          generatedRecipes.push(data.recipe);
        } else {
          updatedFiles[i].status = "error";
          updatedFiles[i].message = "Detection failed - Invalid response";
        }
      } catch (error: any) {
        updatedFiles[i].status = "error";
        updatedFiles[i].message = error.message || "Upload failed";
      }

      setProgress(((i + 1) / totalFiles) * 100);
      setFiles([...updatedFiles]);
    }

    const successCount = updatedFiles.filter((f) => f.status === "success").length;
    const failCount = updatedFiles.filter((f) => f.status === "error").length;

    toast({
      title: "Bulk processing complete",
      description: `${successCount} recipes generated, ${failCount} failed`,
    });

    setUploading(false);
    
    // Pass generated recipes back to parent
    if (onComplete && generatedRecipes.length > 0) {
      onComplete();
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Upload className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Bulk Image Upload</h2>
          <p className="text-sm text-muted-foreground">
            Upload multiple dish images for batch processing
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="bulk-upload"
            disabled={uploading}
          />
          <label htmlFor="bulk-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">
                Click to select multiple images
              </p>
              <p className="text-sm text-muted-foreground">
                or drag and drop files here
              </p>
            </div>
          </label>
        </div>

        {files.length > 0 && (
          <>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {files.length} file(s) selected
              </p>
              <Button
                onClick={() => setFiles([])}
                variant="ghost"
                size="sm"
                disabled={uploading}
              >
                Clear All
              </Button>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {files.map((file, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    {file.status === "pending" && !uploading && (
                      <Button
                        onClick={() => handleRemoveFile(idx)}
                        size="icon"
                        variant="destructive"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    {file.status === "uploading" && (
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    )}
                    {file.status === "success" && (
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    )}
                    {file.status === "error" && (
                      <XCircle className="h-8 w-8 text-red-500" />
                    )}
                  </div>
                  {file.message && (
                    <p className="text-xs mt-1 text-center truncate">
                      {file.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={handleBulkUpload}
              disabled={uploading || files.length === 0}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing {files.length} images...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Process {files.length} Images
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default BulkImageUpload;
