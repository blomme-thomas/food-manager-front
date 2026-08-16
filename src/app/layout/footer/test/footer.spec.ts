import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Footer } from '../footer';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslateService } from '../../../testing/mock-translate.service';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [{ provide: TranslateService, useClass: MockTranslateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
