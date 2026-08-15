export interface NutrientRange {
  min?: number;
  max?: number;
}

export interface GetFoodsRequest {
  name?: string;
  categories?: string[];
  isPersonal?: boolean;
  nutrients?: {
    calories?: NutrientRange;
    proteins?: NutrientRange;
    carbs?: NutrientRange;
    fats?: NutrientRange;
    fibers?: NutrientRange;
    sugars?: NutrientRange;
    salt?: NutrientRange;
  };
  skip?: number;
  take?: number;
}
