import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthProvider } from '../models/auth-provider.model';
import { ExternalAuthResult } from '../models/external-auth-result.model';
import { ExternalAuthProvider } from './external-auth.provider';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthProvider implements ExternalAuthProvider {
  public authenticate(): Observable<ExternalAuthResult> {
    return new Observable<ExternalAuthResult>((subscriber) => {
      try {
        google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (response: google.accounts.id.CredentialResponse) => {
            if (!response.credential) {
              subscriber.error(new Error('Google did not return an ID token.'));
              return;
            }

            subscriber.next({
              provider: AuthProvider.Google,
              credential: response.credential,
            });

            subscriber.complete();
          },
        });

        google.accounts.id.prompt();
      } catch (error: unknown) {
        subscriber.error(error);
      }
    });
  }
}
