import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from '../models/responses/user.response';
import { API_ROUTES } from '@core/api/api-routes';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private readonly http = inject(HttpClient);

  public getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(API_ROUTES.USERS.ME);
  }
}
