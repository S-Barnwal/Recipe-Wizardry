export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      community_recipes: {
        Row: {
          calories: number | null
          confidence_score: number | null
          cook_time: number | null
          created_at: string | null
          dish_name: string
          id: string
          ingredients: Json
          instructions: Json
          likes_count: number | null
          prep_time: number | null
          servings: number | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          confidence_score?: number | null
          cook_time?: number | null
          created_at?: string | null
          dish_name: string
          id?: string
          ingredients: Json
          instructions: Json
          likes_count?: number | null
          prep_time?: number | null
          servings?: number | null
          user_id: string
        }
        Update: {
          calories?: number | null
          confidence_score?: number | null
          cook_time?: number | null
          created_at?: string | null
          dish_name?: string
          id?: string
          ingredients?: Json
          instructions?: Json
          likes_count?: number | null
          prep_time?: number | null
          servings?: number | null
          user_id?: string
        }
        Relationships: []
      }
      dish_ingredients: {
        Row: {
          dish_id: string | null
          id: string
          ingredient_id: string | null
        }
        Insert: {
          dish_id?: string | null
          id?: string
          ingredient_id?: string | null
        }
        Update: {
          dish_id?: string | null
          id?: string
          ingredient_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dish_ingredients_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      dishes: {
        Row: {
          created_at: string | null
          cuisine_type: string | null
          description: string | null
          difficulty: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          cuisine_type?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          cuisine_type?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      ingredient_substitutions: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          original_ingredient: string
          ratio: string | null
          substitute_ingredient: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          original_ingredient: string
          ratio?: string | null
          substitute_ingredient: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          original_ingredient?: string
          ratio?: string | null
          substitute_ingredient?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          category: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      recipe_likes: {
        Row: {
          created_at: string | null
          id: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_likes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "community_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          calories: number | null
          cook_time: number | null
          created_at: string | null
          dish_id: string | null
          id: string
          ingredients: Json
          instructions: Json
          prep_time: number | null
          servings: number | null
        }
        Insert: {
          calories?: number | null
          cook_time?: number | null
          created_at?: string | null
          dish_id?: string | null
          id?: string
          ingredients: Json
          instructions: Json
          prep_time?: number | null
          servings?: number | null
        }
        Update: {
          calories?: number | null
          cook_time?: number | null
          created_at?: string | null
          dish_id?: string | null
          id?: string
          ingredients?: Json
          instructions?: Json
          prep_time?: number | null
          servings?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_recipes: {
        Row: {
          calories: number | null
          confidence_score: number | null
          cook_time: number | null
          created_at: string | null
          dish_name: string
          id: string
          ingredients: Json
          instructions: Json
          prep_time: number | null
          servings: number | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          confidence_score?: number | null
          cook_time?: number | null
          created_at?: string | null
          dish_name: string
          id?: string
          ingredients: Json
          instructions: Json
          prep_time?: number | null
          servings?: number | null
          user_id: string
        }
        Update: {
          calories?: number | null
          confidence_score?: number | null
          cook_time?: number | null
          created_at?: string | null
          dish_name?: string
          id?: string
          ingredients?: Json
          instructions?: Json
          prep_time?: number | null
          servings?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
