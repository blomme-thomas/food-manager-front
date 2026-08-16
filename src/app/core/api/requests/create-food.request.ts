export interface CreateFoodRequest {
  name: { FR?: string; EN?: string };
  baseUnitCode: string;
  caloriesPer100: number;
  proteinsPer100: number;
  carbsPer100: number;
  fatsPer100: number;
  fibersPer100?: number;
  sugarsPer100?: number;
  saltPer100?: number;
}
