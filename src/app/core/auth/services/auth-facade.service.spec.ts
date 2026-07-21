import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { AuthProvider } from '../models/auth-provider.model';
import { ExternalAuthResult } from '../models/external-auth-result.model';
import { AuthRequest } from '../models/requests/auth-request.model';
import { AuthSession } from '../models/responses/auth-session.model';
import { AuthApiService } from './auth-api.service';
import { AuthFacadeService } from './auth-facade.service';
import { AuthProviderRegistryService } from './auth-provider-registry.service';

describe('AuthFacadeService', () => {
  let service: AuthFacadeService;

  let providerMock: {
    authenticate: ReturnType<typeof vi.fn>;
  };

  let authProviderRegistryMock: {
    get: ReturnType<typeof vi.fn>;
  };

  let authApiMock: {
    authenticate: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    providerMock = {
      authenticate: vi.fn(),
    };

    authProviderRegistryMock = {
      get: vi.fn().mockReturnValue(providerMock),
    };

    authApiMock = {
      authenticate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthFacadeService,
        {
          provide: AuthProviderRegistryService,
          useValue: authProviderRegistryMock,
        },
        {
          provide: AuthApiService,
          useValue: authApiMock,
        },
      ],
    });

    service = TestBed.inject(AuthFacadeService);
  });

  it('should get the selected authentication provider', () => {
    const externalResult: ExternalAuthResult = {
      provider: AuthProvider.Google,
      credential: 'google-credential',
    };

    const session: AuthSession = {
      accessToken: 'access-token',
    };

    providerMock.authenticate.mockReturnValue(of(externalResult));
    authApiMock.authenticate.mockReturnValue(of(session));

    service.authenticate(AuthProvider.Google).subscribe();

    expect(authProviderRegistryMock.get).toHaveBeenCalledOnce();
    expect(authProviderRegistryMock.get).toHaveBeenCalledWith(AuthProvider.Google);
  });

  it('should authenticate with the selected external provider', () => {
    const externalResult: ExternalAuthResult = {
      provider: AuthProvider.Google,
      credential: 'google-credential',
    };

    const session: AuthSession = {
      accessToken: 'access-token',
    };

    providerMock.authenticate.mockReturnValue(of(externalResult));
    authApiMock.authenticate.mockReturnValue(of(session));

    service.authenticate(AuthProvider.Google).subscribe();

    expect(providerMock.authenticate).toHaveBeenCalledOnce();
  });

  it('should send the external authentication result to the API', () => {
    const externalResult: ExternalAuthResult = {
      provider: AuthProvider.Google,
      credential: 'google-credential',
    };

    const expectedRequest: AuthRequest = {
      provider: AuthProvider.Google,
      credential: 'google-credential',
    };

    const session: AuthSession = {
      accessToken: 'access-token',
    };

    providerMock.authenticate.mockReturnValue(of(externalResult));
    authApiMock.authenticate.mockReturnValue(of(session));

    service.authenticate(AuthProvider.Google).subscribe();

    expect(authApiMock.authenticate).toHaveBeenCalledOnce();
    expect(authApiMock.authenticate).toHaveBeenCalledWith(expectedRequest);
  });

  it('should return the authentication session from the API', () => {
    const externalResult: ExternalAuthResult = {
      provider: AuthProvider.Google,
      credential: 'google-credential',
    };

    const session: AuthSession = {
      accessToken: 'access-token',
    };

    providerMock.authenticate.mockReturnValue(of(externalResult));
    authApiMock.authenticate.mockReturnValue(of(session));

    let result: AuthSession | undefined;

    service.authenticate(AuthProvider.Google).subscribe((value) => {
      result = value;
    });

    expect(result).toEqual(session);
  });

  it('should not call the API when external authentication fails', () => {
    const error = new Error('Google authentication failed');

    providerMock.authenticate.mockReturnValue(throwError(() => error));

    service.authenticate(AuthProvider.Google).subscribe({
      error: () => undefined,
    });

    expect(authApiMock.authenticate).not.toHaveBeenCalled();
  });

  it('should propagate an external provider error', () => {
    const error = new Error('Google authentication failed');

    providerMock.authenticate.mockReturnValue(throwError(() => error));

    let receivedError: unknown;

    service.authenticate(AuthProvider.Google).subscribe({
      error: (value: unknown) => {
        receivedError = value;
      },
    });

    expect(receivedError).toBe(error);
  });

  it('should propagate an API error', () => {
    const externalResult: ExternalAuthResult = {
      provider: AuthProvider.Google,
      credential: 'google-credential',
    };

    const error = new Error('Backend authentication failed');

    providerMock.authenticate.mockReturnValue(of(externalResult));
    authApiMock.authenticate.mockReturnValue(throwError(() => error));

    let receivedError: unknown;

    service.authenticate(AuthProvider.Google).subscribe({
      error: (value: unknown) => {
        receivedError = value;
      },
    });

    expect(receivedError).toBe(error);
  });
});
