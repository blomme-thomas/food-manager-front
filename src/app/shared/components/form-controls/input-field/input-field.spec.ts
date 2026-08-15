import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InputFieldComponent } from './input-field';

describe('InputFieldComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldComponent],
    }).compileComponents();
  });

  const render = (disabled: boolean) => {
    const fixture = TestBed.createComponent(InputFieldComponent);

    fixture.componentInstance.formControl = new FormControl('');
    fixture.componentInstance.disabled = disabled;
    fixture.detectChanges();

    return fixture;
  };

  it('should not warn about the disabled attribute on a reactive form directive', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(false);

    expect(warn).not.toHaveBeenCalled();
  });

  it('should disable the input when the disabled option is set', () => {
    const fixture = render(true);
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    expect(input.disabled).toBe(true);
  });

  it('should leave the input enabled by default', () => {
    const fixture = render(false);
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    expect(input.disabled).toBe(false);
  });
});
