import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Header } from './header';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@core/api/services/user.service';
import { MockTranslateService } from '../../testing/mock-translate.service';
import { MockUserService } from '../../testing/mock-user.service';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([]),
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: UserService, useClass: MockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
