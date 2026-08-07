import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { noop } from 'rxjs';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.html',
  styleUrls: ['./input-field.scss'],
  standalone: true,
  host: { class: 'app-field' },
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true,
    },
  ],
})
export class InputFieldComponent<T = string> implements ControlValueAccessor {
  @Input() label: string | null = null;
  @Input() disabled = false;
  @Input() required = false;
  @Input() placeholder?: string;
  @Input() hint?: string;
  @Input() errorMessage?: string;
  @Input() formControl: FormControl = new FormControl();

  value: T | null = null;
  isTouched = false;

  onChange: (value: T | null) => void = noop;
  onTouched: () => void = noop;

  writeValue(value: T | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get hasError(): boolean {
    return !!(this.formControl?.invalid && (this.formControl?.touched || this.isTouched));
  }

  get errorText(): string {
    const errors = this.formControl?.errors;
    if (errors?.['required']) return 'Ce champ est requis';
    if (errors?.['email']) return 'Email invalide';
    if (errors?.['minlength']) return `Min ${errors['minlength'].requiredLength} caractères`;
    if (errors?.['maxlength']) return `Max ${errors['maxlength'].requiredLength} caractères`;
    if (errors?.['pattern']) return 'Format invalide';
    return this.errorMessage || '';
  }

  onBlur(): void {
    this.isTouched = true;
    this.onTouched();
  }
}
