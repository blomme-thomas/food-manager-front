import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRequest } from '../models/requests/auth-request.model';
import { AuthSession } from '../models/responses/auth-session.model';
import { API_ROUTES } from '@core/api/api-routes';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);

  public authenticate(request: AuthRequest): Observable<AuthSession> {
    return this.http.post<AuthSession>(API_ROUTES.AUTH.EXTERNAL, request);
  }
}
