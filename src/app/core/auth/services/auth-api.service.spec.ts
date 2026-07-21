import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_ROUTES } from '@core/api/api-routes';
import { AuthProvider } from '../models/auth-provider.model';
import { AuthRequest } from '../models/requests/auth-request.model';
import { AuthSession } from '../models/responses/auth-session.model';
import { AuthApiService } from './auth-api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('authenticate', () => {
    it('should send an authentication request to the external auth endpoint', () => {
      const request: AuthRequest = {
        provider: AuthProvider.Google,
        credential: 'google-token',
      };

      const session: AuthSession = {
        accessToken: 'access-token',
      };

      service.authenticate(request).subscribe((result) => {
        expect(result).toEqual(session);
      });

      const httpRequest = httpTestingController.expectOne(API_ROUTES.AUTH.EXTERNAL);

      expect(httpRequest.request.method).toBe('POST');
      expect(httpRequest.request.body).toEqual(request);

      httpRequest.flush(session);
    });

    it('should propagate an HTTP error', () => {
      const request: AuthRequest = {
        provider: AuthProvider.Google,
        credential: 'invalid-token',
      };

      service.authenticate(request).subscribe({
        next: () => {
          throw new Error('Expected authentication to fail');
        },
        error: (error: unknown) => {
          expect(error).toBeTruthy();
        },
      });

      const httpRequest = httpTestingController.expectOne(API_ROUTES.AUTH.EXTERNAL);

      httpRequest.flush(
        {
          message: 'Unauthorized',
        },
        {
          status: 401,
          statusText: 'Unauthorized',
        },
      );
    });
  });
});
