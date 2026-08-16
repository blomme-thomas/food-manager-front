import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthFacadeService } from '@core/auth/services/auth-facade.service';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Register } from '../register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  let authFacadeMock: {
    registerExternalUser: ReturnType<typeof vi.fn>;
  };

  let routerMock: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authFacadeMock = {
      registerExternalUser: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [Register],
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

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
