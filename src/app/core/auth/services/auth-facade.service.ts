import { Injectable, inject } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { AuthProvider } from '../models/auth-provider.model';
import { ExternalAuthResult } from '../models/external-auth-result.model';
import { AuthProviderRegistryService } from './auth-provider-registry.service';
import { AuthRequest } from '../models/requests/auth-request.model';
import { AuthSession } from '../models/responses/auth-session.model';
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

  public authenticate(provider: AuthProvider): Observable<AuthSession> {
    return this.authProviderRegistry
      .get(provider)
      .authenticate()
      .pipe(
        map((result: ExternalAuthResult): AuthRequest => this.toAuthRequest(result)),
        switchMap((request: AuthRequest): Observable<AuthSession> => {
          console.log('Sending authentication request to API:', request);
          return this.authApi.authenticate(request);
        }),
      );
  }
}
