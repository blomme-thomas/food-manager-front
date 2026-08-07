import { Component, forwardRef, inject, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { noop } from 'rxjs';
import { NzInputModule } from 'ng-zorro-antd/input';
import { LanguageService } from '@core/services/language.service';

export interface SelectOption {
  label: {
    EN: string;
    FR: string;
  };
  value: string | number;
}

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.html',
  styleUrls: ['./input-select.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzInputModule, NzFormModule, NzSelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelectComponent),
      multi: true,
    },
  ],
})
export class InputSelectComponent implements ControlValueAccessor, OnInit {
  languageService = inject(LanguageService);

  @Input() label: string | null = null;
  @Input() options: SelectOption[] = [];
  @Input() disabled = false;
  @Input() placeholder = '';
  @Input() hint?: string;
  @Input() errorMessage?: string;
  @Input() formControl: FormControl = new FormControl();
  @Input() multiple = false;

  value: string | number | null = null;
  isTouched = false;
  language: string | null = localStorage.getItem('food-manager-language');

  onChange: (value: string | number | null) => void = noop;
  onTouched: () => void = noop;

  get hasError(): boolean {
    return this.formControl.invalid && (this.formControl.dirty || this.isTouched);
  }

  ngOnInit(): void {
    this.languageService.language$.subscribe((lang) => {
      this.language = lang;
    });
  }

  writeValue(value: string | number | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
