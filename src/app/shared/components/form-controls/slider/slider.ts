import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { noop } from 'rxjs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.html',
  styleUrls: ['./slider.scss'],
  standalone: true,
  host: { class: 'app-field' },
  imports: [ReactiveFormsModule, NzFormModule, CommonModule, NzSliderModule, NzInputModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
})
export class SliderComponent implements ControlValueAccessor {
  @Input() label: string | null = null;
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() disabled = false;
  @Input() unit?: string;
  @Input() formControl: FormControl = new FormControl([0, 100]);

  onChange: (value: number[] | null) => void = noop;
  onTouched: () => void = noop;

  get minValue(): number {
    return this.formControl.value?.[0] ?? this.min;
  }

  get maxValue(): number {
    return this.formControl.value?.[1] ?? this.max;
  }

  onMinChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const next = this.clamp(input.value, this.min, this.maxValue, this.minValue);

    input.value = String(next);
    this.formControl.setValue([next, this.maxValue]);
  }

  onMaxChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const next = this.clamp(input.value, this.minValue, this.max, this.maxValue);

    input.value = String(next);
    this.formControl.setValue([this.minValue, next]);
  }

  private clamp(raw: string, lower: number, upper: number, current: number): number {
    const parsed = Number(raw);

    if (raw.trim() === '' || Number.isNaN(parsed)) {
      return current;
    }

    return Math.min(Math.max(parsed, lower), upper);
  }

  writeValue(value: number[] | null): void {
    if (value && value !== this.formControl.value) {
      this.formControl.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: (value: number[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
