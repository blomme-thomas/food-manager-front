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

@Component({
  selector: 'app-slider',
  templateUrl: './slider.html',
  styleUrls: ['./slider.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, CommonModule, NzSliderModule],
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

  writeValue(value: number[] | null): void {
    if (value) {
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
