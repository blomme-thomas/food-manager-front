import { Injectable } from '@angular/core';
import { AuthenticationResult, PublicClientApplication } from '@azure/msal-browser';
import { defer, from, map, Observable, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthProvider } from '../models/auth-provider.model';
import { ExternalAuthResult } from '../models/external-auth-result.model';
import { ExternalAuthProvider } from './external-auth.provider';

@Injectable({
  providedIn: 'root',
})
export class MicrosoftAuthProvider implements ExternalAuthProvider {
  private readonly application = new PublicClientApplication({
    auth: {
      clientId: environment.microsoftClientId,
      authority: environment.microsoftAuthority,
      redirectUri: environment.microsoftRedirectUri,
    },
    cache: {
      cacheLocation: 'localStorage',
    },
  });

  private initializationPromise: Promise<void> | null = null;

  public authenticate(): Observable<ExternalAuthResult> {
    return defer(() => this.initialize()).pipe(
      switchMap(() =>
        from(
          this.application.loginPopup({
            scopes: ['openid', 'profile', 'email'],
            prompt: 'select_account',
            redirectUri: environment.microsoftRedirectUri,
          }),
        ),
      ),
      map((result: AuthenticationResult): ExternalAuthResult => {
        if (!result.idToken) {
          throw new Error('Microsoft did not return an ID token.');
        }

        return {
          provider: AuthProvider.Microsoft,
          credential: result.idToken,
        };
      }),
    );
  }

  private initialize(): Promise<void> {
    this.initializationPromise ??= this.application.initialize();

    return this.initializationPromise;
  }
}
