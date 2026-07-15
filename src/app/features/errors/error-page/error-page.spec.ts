import { TestBed } from '@angular/core/testing';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ErrorPageComponent } from './error-page';
import { MockTranslateService } from '../../../testing/mock-translate.service';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: unknown): unknown {
    return value;
  }
}

@Component({
  standalone: true,
  imports: [ErrorPageComponent],
  template: `
    <app-error-page
      code="403"
      variant="forbidden"
      titleKey="ERRORS.403.TITLE"
      descriptionKey="ERRORS.403.MESSAGE"
      illustrationLabelKey="ERRORS.403.ILLUSTRATION_LABEL"
    ></app-error-page>
  `,
})
class HostComponent {}

describe('ErrorPageComponent (standalone host)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, MockTranslatePipe],
      providers: [provideRouter([]), { provide: TranslateService, useClass: MockTranslateService }],
    }).compileComponents();

    // Override the ErrorPageComponent imports to use the mock pipe instead of the real TranslatePipe
    TestBed.overrideComponent(ErrorPageComponent as unknown as typeof ErrorPageComponent, {
      set: { imports: [CommonModule, RouterModule, MockTranslatePipe] },
    });
  });

  it('renders code and title without duplicating the code prefix', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const code = el.querySelector('.error-card__code')?.textContent?.trim() ?? '';
    const title = el.querySelector('.error-card__title')?.textContent?.trim() ?? '';

    expect(code).toBe('403');
    expect(title).toContain('ERRORS.403.TITLE');
    expect(title).not.toContain('403 - ');
  });
});
