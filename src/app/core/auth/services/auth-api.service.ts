import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRequest } from '../models/requests/auth-request.model';
import { AuthenticateExternalIdentityResponse } from '../models/responses/authenticate-external-identity.response';
import { RegisterExternalUserRequest } from '../models/requests/register-external-user.request';
import { RegisterExternalUserResponse } from '../models/responses/register-external-user.response';
import { API_ROUTES } from '@core/api/api-routes';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);

  public authenticateExternal(
    request: AuthRequest,
  ): Observable<AuthenticateExternalIdentityResponse> {
    return this.http.post<AuthenticateExternalIdentityResponse>(API_ROUTES.AUTH.EXTERNAL, request);
  }

  public registerExternalUser(
    request: RegisterExternalUserRequest,
  ): Observable<RegisterExternalUserResponse> {
    return this.http.post<RegisterExternalUserResponse>(API_ROUTES.USERS.REGISTER, request);
  }
}
