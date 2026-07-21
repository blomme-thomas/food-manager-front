import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GoogleAuthProvider } from './google-auth.provider';
import { AuthProvider } from '../models/auth-provider.model';
import { environment } from '../../../../environments/environment';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

describe('GoogleAuthProvider', () => {
  let provider: GoogleAuthProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleAuthProvider],
    });
    provider = TestBed.inject(GoogleAuthProvider);

    window.google = {
      accounts: {
        id: {
          initialize: vi.fn(),
          prompt: vi.fn(),
        },
      },
    };
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  it('should initialize google accounts with correct client_id', () => {
    return new Promise<void>((resolve) => {
      provider.authenticate().subscribe(() => {
        if (window.google) {
          expect(window.google.accounts.id.initialize).toHaveBeenCalledWith(
            expect.objectContaining({
              client_id: environment.googleClientId,
            }),
          );
        }
        resolve();
      });

      if (window.google) {
        const initCall = vi.mocked(window.google.accounts.id.initialize).mock.calls[0];
        initCall[0].callback({ credential: 'fake-jwt-token' });
      }
    });
  });

  it('should emit ExternalAuthResult with Google provider and JWT credential', () => {
    return new Promise<void>((resolve) => {
      provider.authenticate().subscribe((result) => {
        expect(result.provider).toBe(AuthProvider.Google);
        expect(result.credential).toBe('fake-jwt-token');
        resolve();
      });

      if (window.google) {
        const callback = vi.mocked(window.google.accounts.id.initialize).mock.calls[0][0].callback;
        callback({ credential: 'fake-jwt-token' });
      }
    });
  });

  it('should error when Google does not return a credential', () => {
    return new Promise<void>((resolve) => {
      provider.authenticate().subscribe({
        next: () => {
          throw new Error('Should have errored');
        },
        error: (error: Error) => {
          expect(error.message).toBe('Google did not return an ID token.');
          resolve();
        },
      });

      if (window.google) {
        const callback = vi.mocked(window.google.accounts.id.initialize).mock.calls[0][0].callback;
        (callback as (response: { credential?: string | null }) => void)({ credential: null });
      }
    });
  });

  it('should call prompt to display One Tap', () => {
    return new Promise<void>((resolve) => {
      provider.authenticate().subscribe(() => {
        if (window.google) {
          expect(window.google.accounts.id.prompt).toHaveBeenCalled();
        }
        resolve();
      });

      if (window.google) {
        const callback = vi.mocked(window.google.accounts.id.initialize).mock.calls[0][0].callback;
        callback({ credential: 'fake-jwt-token' });
      }
    });
  });

  it('should error when Google is unavailable', () => {
    return new Promise<void>((resolve) => {
      window.google = undefined;

      provider.authenticate().subscribe({
        next: () => {
          throw new Error('Should have errored');
        },
        error: (error: Error) => {
          expect(error.message).toBe('Google Identity Services is unavailable.');
          resolve();
        },
      });
    });
  });
});
