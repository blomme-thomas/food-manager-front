import { Injectable, inject } from '@angular/core';
import { AuthProvider } from '../models/auth-provider.model';
import { ExternalAuthProvider } from '../providers/external-auth.provider';
import { GoogleAuthProvider } from '../providers/google-auth.provider';
import { MicrosoftAuthProvider } from '../providers/microsoft-auth.provider';

@Injectable({
  providedIn: 'root',
})
export class AuthProviderRegistryService {
  private readonly googleAuthProvider = inject(GoogleAuthProvider);
  private readonly microsoftAuthProvider = inject(MicrosoftAuthProvider);

  private readonly providers = new Map<AuthProvider, ExternalAuthProvider>([
    [AuthProvider.Google, this.googleAuthProvider],
    [AuthProvider.Microsoft, this.microsoftAuthProvider],
  ]);

  public get(provider: AuthProvider): ExternalAuthProvider {
    const authProvider = this.providers.get(provider);

    if (!authProvider) {
      throw new Error(`Unsupported authentication provider: ${provider}`);
    }

    return authProvider;
  }

  public has(provider: AuthProvider): boolean {
    return this.providers.has(provider);
  }
}
