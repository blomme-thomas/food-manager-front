import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { noop } from 'rxjs';

@Component({
  selector: 'app-input-range',
  templateUrl: './input-range.html',
  styleUrls: ['./input-range.scss'],
  standalone: true,
  host: { class: 'app-field' },
  imports: [ReactiveFormsModule, NzFormModule, CommonModule, NzInputModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputRangeComponent),
      multi: true,
    },
  ],
})
export class InputRangeComponent implements ControlValueAccessor {
  @Input() label: string | null = null;
  @Input() disabled = false;
  @Input() unit?: string;
  @Input() formControl: FormControl = new FormControl(null);

  onChange: (value: { min: number | null; max: number | null } | null) => void = noop;
  onTouched: () => void = noop;

  get minValue(): number | null {
    return this.formControl.value?.min ?? null;
  }

  set minValue(value: number | null) {
    this.formControl.setValue({
      ...this.formControl.value,
      min: value,
    });
  }

  get maxValue(): number | null {
    return this.formControl.value?.max ?? null;
  }

  set maxValue(value: number | null) {
    this.formControl.setValue({
      ...this.formControl.value,
      max: value,
    });
  }

  writeValue(value: { min: number | null; max: number | null } | null): void {
    if (value) {
      this.formControl.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: (value: { min: number | null; max: number | null } | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
