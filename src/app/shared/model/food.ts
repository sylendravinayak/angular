export interface FoodCategory {
  category_id: number;
  category_name: string;
}

export interface FoodItem {
  food_id: number;
  item_name: string;
  description?: string | null;
  price: number; // Numeric(10,2) arrives as number from API
  category_id?: number | null;
  is_available: boolean;
  image_url?: string | null;
  is_veg?: boolean | null;

}