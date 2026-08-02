import { Injectable, inject } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { AuthProvider } from '../models/auth-provider.model';
import { ExternalAuthResult } from '../models/external-auth-result.model';
import { AuthenticateExternalIdentityResponse } from '../models/responses/authenticate-external-identity.response';
import { RegisterExternalUserRequest } from '../models/requests/register-external-user.request';
import { RegisterExternalUserResponse } from '../models/responses/register-external-user.response';
import { AuthProviderRegistryService } from './auth-provider-registry.service';
import { AuthRequest } from '../models/requests/auth-request.model';
import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthFacadeService {
  private readonly authProviderRegistry = inject(AuthProviderRegistryService);
  private readonly authApi = inject(AuthApiService);

  private toAuthRequest(result: ExternalAuthResult): AuthRequest {
    return {
      provider: result.provider,
      credential: result.credential,
    };
  }

  public authenticateExternal(
    provider: AuthProvider,
  ): Observable<AuthenticateExternalIdentityResponse> {
    return this.authProviderRegistry
      .get(provider)
      .authenticate()
      .pipe(
        map((result: ExternalAuthResult): AuthRequest => this.toAuthRequest(result)),
        switchMap((request: AuthRequest): Observable<AuthenticateExternalIdentityResponse> => {
          console.log('Sending authentication request to API:', request);
          return this.authApi.authenticateExternal(request);
        }),
      );
  }

  public registerExternalUser(
    request: RegisterExternalUserRequest,
  ): Observable<RegisterExternalUserResponse> {
    return this.authApi.registerExternalUser(request);
  }
}
