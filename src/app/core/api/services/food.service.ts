import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../responses/category.response';
import { FoodResponse } from '../responses/food.response';
import { API_ROUTES } from '@core/api/api-routes';
import { GetFoodsRequest } from '../requests/get-foods.request';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private readonly http = inject(HttpClient);

  public getFoods(request: GetFoodsRequest): Observable<FoodResponse[]> {
    return this.http.post<FoodResponse[]>(API_ROUTES.FOODS.GET, request);
  }

  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(API_ROUTES.FOODS.CATEGORIES);
  }
}
