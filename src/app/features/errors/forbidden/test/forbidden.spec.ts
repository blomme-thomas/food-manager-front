import { TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ForbiddenComponent } from '../forbidden';
import { MockTranslateService } from '../../../../testing/mock-translate.service';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: unknown): unknown {
    return value;
  }
}

describe('ForbiddenComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForbiddenComponent, MockTranslatePipe],
      providers: [provideRouter([]), { provide: TranslateService, useClass: MockTranslateService }],
    }).compileComponents();

    const mod = await import('../../error-page/error-page');
    TestBed.overrideComponent(mod.ErrorPageComponent as unknown as typeof mod.ErrorPageComponent, {
      set: { imports: [CommonModule, RouterModule, MockTranslatePipe] },
    });
  });

  it('creates and contains the error page', () => {
    const fixture = TestBed.createComponent(ForbiddenComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-error-page')).toBeTruthy();
  });
});
