import { Observable } from 'rxjs';
import { ExternalAuthResult } from '../models/external-auth-result.model';

export interface ExternalAuthProvider {
  authenticate(): Observable<ExternalAuthResult>;
}
