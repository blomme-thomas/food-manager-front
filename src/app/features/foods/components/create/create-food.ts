import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateFoodRequest } from '@core/api/requests/create-food.request';
import { FoodService } from '@core/api/services/food.service';
import { TranslatePipe } from '@ngx-translate/core';
import { InputFieldComponent } from '@shared/components/form-controls/input-field/input-field';
import {
  InputSelectComponent,
  SelectOption,
} from '@shared/components/form-controls/input-select/input-select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { finalize } from 'rxjs';
import { atLeastOneNameValidator } from './create-food.validators';

const MAX_MACRO_VALUE = 100;
const MAX_CALORIES_VALUE = 1000;
const MIN_VALUE = 0;
const NAME_MAX_LENGTH = 150;

interface NameFormControls {
  FR: FormControl<string | null>;
  EN: FormControl<string | null>;
}

interface CreateFoodFormControls {
  name: FormGroup<NameFormControls>;
  baseUnitCode: FormControl<string | null>;
  caloriesPer100: FormControl<number | null>;
  proteinsPer100: FormControl<number | null>;
  carbsPer100: FormControl<number | null>;
  fatsPer100: FormControl<number | null>;
  fibersPer100: FormControl<number | null>;
  sugarsPer100: FormControl<number | null>;
  saltPer100: FormControl<number | null>;
}

@Component({
  selector: 'app-create-food',
  templateUrl: './create-food.html',
  styleUrls: ['./create-food.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputFieldComponent,
    InputSelectComponent,
    TranslatePipe,
    NzButtonModule,
  ],
})
export class CreateFoodComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly foodService = inject(FoodService);
  private readonly destroyRef = inject(DestroyRef);

  public unitOptions: SelectOption[] = [];

  public readonly created = output<void>();

  public readonly isLoading = signal(false);
  public readonly errorMessage = signal<string | null>(null);
  public readonly submitted = signal(false);

  public readonly createForm: FormGroup<CreateFoodFormControls> = this.buildForm();

  public ngOnInit(): void {
    this.foodService
      .getUnits()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((units) => {
        this.unitOptions = units.map((unit) => ({
          label: { FR: unit, EN: unit },
          value: unit,
        }));
      });
  }

  public submit(): void {
    if (this.createForm.invalid) {
      this.submitted.set(true);
      this.createForm.markAllAsTouched();
      return;
    }

    this.submitted.set(true);
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.foodService
      .createFood(this.buildRequest())
      .pipe(
        finalize((): void => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (): void => {
          this.created.emit();
        },
        error: (error: unknown): void => {
          console.error(error);
          this.errorMessage.set('ERRORS.GENERIC_MESSAGE');
        },
      });
  }

  private buildForm(): FormGroup<CreateFoodFormControls> {
    return this.fb.group<CreateFoodFormControls>({
      name: this.fb.group(
        {
          FR: this.fb.control<string | null>(null, [Validators.maxLength(NAME_MAX_LENGTH)]),
          EN: this.fb.control<string | null>(null, [Validators.maxLength(NAME_MAX_LENGTH)]),
        },
        { validators: atLeastOneNameValidator() },
      ),
      baseUnitCode: this.fb.control<string | null>(null, [Validators.required]),
      caloriesPer100: this.fb.control<number | null>(null, [
        Validators.required,
        Validators.min(MIN_VALUE),
        Validators.max(MAX_CALORIES_VALUE),
      ]),
      proteinsPer100: this.fb.control<number | null>(null, [
        Validators.required,
        Validators.min(MIN_VALUE),
        Validators.max(MAX_MACRO_VALUE),
      ]),
      carbsPer100: this.fb.control<number | null>(null, [
        Validators.required,
        Validators.min(MIN_VALUE),
        Validators.max(MAX_MACRO_VALUE),
      ]),
      fatsPer100: this.fb.control<number | null>(null, [
        Validators.required,
        Validators.min(MIN_VALUE),
        Validators.max(MAX_MACRO_VALUE),
      ]),
      fibersPer100: this.fb.control<number | null>(null, [
        Validators.min(MIN_VALUE),
        Validators.max(MAX_MACRO_VALUE),
      ]),
      sugarsPer100: this.fb.control<number | null>(null, [
        Validators.min(MIN_VALUE),
        Validators.max(MAX_MACRO_VALUE),
      ]),
      saltPer100: this.fb.control<number | null>(null, [
        Validators.min(MIN_VALUE),
        Validators.max(MAX_MACRO_VALUE),
      ]),
    });
  }

  private buildRequest(): CreateFoodRequest {
    const value = this.createForm.getRawValue();

    const name: CreateFoodRequest['name'] = {};
    const fr = value.name.FR?.trim();
    const en = value.name.EN?.trim();
    if (fr) {
      name.FR = fr;
    }
    if (en) {
      name.EN = en;
    }

    const request: CreateFoodRequest = {
      name,
      baseUnitCode: value.baseUnitCode ?? '',
      caloriesPer100: value.caloriesPer100 ?? MIN_VALUE,
      proteinsPer100: value.proteinsPer100 ?? MIN_VALUE,
      carbsPer100: value.carbsPer100 ?? MIN_VALUE,
      fatsPer100: value.fatsPer100 ?? MIN_VALUE,
    };

    if (value.fibersPer100 !== null && value.fibersPer100 !== undefined) {
      request.fibersPer100 = value.fibersPer100;
    }
    if (value.sugarsPer100 !== null && value.sugarsPer100 !== undefined) {
      request.sugarsPer100 = value.sugarsPer100;
    }
    if (value.saltPer100 !== null && value.saltPer100 !== undefined) {
      request.saltPer100 = value.saltPer100;
    }

    return request;
  }
}
