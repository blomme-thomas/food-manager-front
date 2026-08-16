import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InputFieldComponent } from '../input-field';
import { InputFieldType } from '../input-field.model';

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

  it('should hold a numeric FormControl value when type is number and the user types a value', () => {
    const fixture = TestBed.createComponent(InputFieldComponent<number>);
    const formControl = new FormControl<number | null>(null);
    fixture.componentInstance.type = InputFieldType.Number;
    fixture.componentInstance.formControl = formControl;
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.type).toBe('number');

    input.value = '42';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(formControl.value).toBe(42);
    expect(typeof formControl.value).toBe('number');
  });
});
