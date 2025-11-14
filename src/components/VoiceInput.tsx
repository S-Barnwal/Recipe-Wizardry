import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

const VoiceInput = ({ onTranscript }: VoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording...",
        description: "Speak your ingredients clearly",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(",")[1];
        
        toast({
          title: "Processing...",
          description: "Converting speech to text",
        });
        
        // Call voice-to-text edge function
        const { supabase } = await import("@/integrations/supabase/client");
        const { data, error } = await supabase.functions.invoke('voice-to-text', {
          body: { audio: base64Audio }
        });

        setIsProcessing(false);

        if (error) {
          throw error;
        }

        if (data?.text) {
          onTranscript(data.text);
          toast({
            title: "Success!",
            description: "Voice input processed",
          });
        } else {
          throw new Error("No transcription received");
        }
      };
    } catch (error) {
      console.error("Error processing audio:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process audio",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isProcessing ? (
        <Button disabled variant="outline" size="icon">
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Button
          type="button"
          variant={isRecording ? "destructive" : "outline"}
          size="icon"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
      )}
      <span className="text-sm text-muted-foreground">
        {isRecording ? "Recording..." : isProcessing ? "Processing..." : "Voice Input"}
      </span>
    </div>
  );
};

export default VoiceInput;
