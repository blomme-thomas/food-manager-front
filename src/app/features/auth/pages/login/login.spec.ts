import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthProvider } from '@core/auth/models/auth-provider.model';
import { AuthFacadeService } from '@core/auth/services/auth-facade.service';
import { provideTranslateService } from '@ngx-translate/core';
import { Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  let authFacadeMock: {
    authenticate: ReturnType<typeof vi.fn>;
  };

  let routerMock: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authFacadeMock = {
      authenticate: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideTranslateService(),
        {
          provide: AuthFacadeService,
          useValue: authFacadeMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should authenticate with the selected provider', () => {
    const authentication$ = new Subject<unknown>();

    authFacadeMock.authenticate.mockReturnValue(authentication$.asObservable());

    component.authenticate(AuthProvider.Google);

    expect(authFacadeMock.authenticate).toHaveBeenCalledOnce();
    expect(authFacadeMock.authenticate).toHaveBeenCalledWith(AuthProvider.Google);

    authentication$.complete();
  });

  it('should enable loading while authentication is in progress', () => {
    const authentication$ = new Subject<unknown>();

    authFacadeMock.authenticate.mockReturnValue(authentication$.asObservable());

    component.authenticate(AuthProvider.Google);

    expect(component.isLoading()).toBe(true);

    authentication$.complete();
  });

  it('should clear the previous error before authentication', () => {
    const authentication$ = new Subject<unknown>();

    authFacadeMock.authenticate.mockReturnValue(authentication$.asObservable());

    component.errorMessage.set('AUTH.ERRORS.GENERIC');

    component.authenticate(AuthProvider.Google);

    expect(component.errorMessage()).toBeNull();

    authentication$.complete();
  });

  it('should navigate to the dashboard after successful authentication', () => {
    const authentication$ = new Subject<unknown>();

    authFacadeMock.authenticate.mockReturnValue(authentication$.asObservable());

    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    component.authenticate(AuthProvider.Google);

    const authenticationResult = {
      accessToken: 'access-token',
    };

    authentication$.next(authenticationResult);
    authentication$.complete();

    expect(routerMock.navigate).toHaveBeenCalledOnce();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should disable loading after successful authentication', () => {
    const authentication$ = new Subject<unknown>();

    authFacadeMock.authenticate.mockReturnValue(authentication$.asObservable());

    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    component.authenticate(AuthProvider.Google);

    expect(component.isLoading()).toBe(true);

    authentication$.next({});
    authentication$.complete();

    expect(component.isLoading()).toBe(false);
  });

  it('should display a generic error when authentication fails', () => {
    const authenticationError = new Error('Authentication failed');

    authFacadeMock.authenticate.mockReturnValue(throwError(() => authenticationError));

    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    component.authenticate(AuthProvider.Google);

    expect(component.errorMessage()).toBe('AUTH.ERRORS.GENERIC');
  });

  it('should disable loading when authentication fails', () => {
    authFacadeMock.authenticate.mockReturnValue(
      throwError(() => new Error('Authentication failed')),
    );

    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    component.authenticate(AuthProvider.Google);

    expect(component.isLoading()).toBe(false);
  });

  it('should not navigate when authentication fails', () => {
    authFacadeMock.authenticate.mockReturnValue(
      throwError(() => new Error('Authentication failed')),
    );

    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    component.authenticate(AuthProvider.Google);

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
