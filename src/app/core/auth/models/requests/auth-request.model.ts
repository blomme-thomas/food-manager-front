import { AuthProvider } from '../auth-provider.model';

export interface AuthRequest {
  readonly provider: AuthProvider;
  readonly credential: string;
}
