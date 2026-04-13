import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// In-memory cache to avoid re-generating images for the same dish
const imageCache = new Map<string, string>();

export function useDishImage(dishName: string, fallbackImage: string) {
  const [image, setImage] = useState<string>(fallbackImage);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dishName) return;

    const key = dishName.toLowerCase().trim();

    // Check cache first
    if (imageCache.has(key)) {
      setImage(imageCache.get(key)!);
      return;
    }

    let cancelled = false;
    setLoading(true);

    supabase.functions.invoke('generate-dish-image', {
      body: { dishName },
    }).then(({ data, error }) => {
      if (cancelled) return;
      if (!error && data?.image) {
        imageCache.set(key, data.image);
        setImage(data.image);
      }
      // On error, keep fallback image
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [dishName, fallbackImage]);

  return { image, loading };
}
