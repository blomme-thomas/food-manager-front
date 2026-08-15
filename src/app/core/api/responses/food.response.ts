export interface Translation {
  EN: string;
  FR: string;
}

export interface Category {
  name: Translation;
}

export interface FoodResponse {
  id: string;
  name: Translation;
  caloriesPer100: number;
  proteinsPer100: number;
  carbsPer100: number;
  fatsPer100: number;
  fibersPer100?: number | null;
  sugarsPer100?: number | null;
  saltPer100?: number | null;
  category: Category;
  baseUnit: string;
}

export interface PaginatedFoodResponse {
  items: FoodResponse[];
  total: number;
}
