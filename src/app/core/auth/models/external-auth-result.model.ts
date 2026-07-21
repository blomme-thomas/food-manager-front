import { AuthProvider } from './auth-provider.model';

export interface ExternalAuthResult {
  readonly provider: AuthProvider;
  readonly credential: string;
}
