import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../responses/category.response';
import { FoodResponse, PaginatedFoodResponse } from '../responses/food.response';
import { API_ROUTES } from '@core/api/api-routes';
import { GetFoodsRequest } from '../requests/get-foods.request';
import { CreateFoodRequest } from '../requests/create-food.request';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private readonly http = inject(HttpClient);

  public getFoods(request: GetFoodsRequest): Observable<PaginatedFoodResponse> {
    return this.http.post<PaginatedFoodResponse>(API_ROUTES.FOODS.SEARCH, request);
  }

  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(API_ROUTES.FOODS.CATEGORIES);
  }

  public getUnits(): Observable<string[]> {
    return this.http.get<string[]>(API_ROUTES.FOODS.UNITS);
  }

  public createFood(request: CreateFoodRequest): Observable<FoodResponse> {
    return this.http.post<FoodResponse>(API_ROUTES.FOODS.CREATE, request);
  }
}
