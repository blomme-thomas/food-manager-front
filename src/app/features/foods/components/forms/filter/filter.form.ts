import { Component, inject, OnInit, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FoodService } from '@core/api/services/food.service';
import { GetFoodsRequest, NutrientRange } from '@core/api/requests/get-foods.request';
import { TranslatePipe } from '@ngx-translate/core';
import { InputFieldComponent } from '@shared/components/form-controls/input-field/input-field';
import {
  InputSelectComponent,
  SelectOption,
} from '@shared/components/form-controls/input-select/input-select';
import { SliderComponent } from '@shared/components/form-controls/slider/slider';
import { InputRangeComponent } from '@shared/components/form-controls/input-range/input-range';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzButtonModule } from 'ng-zorro-antd/button';

const SLIDER_MIN = 0;
const SLIDER_MAX = 100;

type NutrientKey = keyof NonNullable<GetFoodsRequest['nutrients']>;
type Nutrients = NonNullable<GetFoodsRequest['nutrients']>;

interface CaloriesValue {
  min: number | null;
  max: number | null;
}

interface FilterFormControls {
  name: FormControl<string | null>;
  categories: FormControl<string[] | null>;
  isPersonal: FormControl<boolean>;
  calories: FormControl<CaloriesValue | null>;
  proteins: FormControl<number[]>;
  carbs: FormControl<number[]>;
  fats: FormControl<number[]>;
  fibers: FormControl<number[]>;
  sugars: FormControl<number[]>;
  salt: FormControl<number[]>;
}

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter.form.html',
  styleUrls: ['./filter.form.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SliderComponent,
    InputFieldComponent,
    InputSelectComponent,
    TranslatePipe,
    InputRangeComponent,
    NzCollapseModule,
    NzButtonModule,
  ],
})
export class FilterFormComponent implements OnInit {
  fb = inject(FormBuilder);
  foodsService = inject(FoodService);
  categoryOptions: SelectOption[] = [];

  readonly filtersApply = output<GetFoodsRequest>();

  filterForm: FormGroup<FilterFormControls> = this.buildForm();

  ngOnInit(): void {
    const lang = localStorage.getItem('food-manager-language');
    this.foodsService.getCategories().subscribe((categories) => {
      this.categoryOptions = categories.map((category) => ({
        label: {
          EN: category.EN,
          FR: category.FR,
        },
        value: lang === 'fr' ? category.FR : category.EN,
      }));
    });
  }

  applyFilters(): void {
    this.filtersApply.emit(this.buildRequest());
  }

  resetFilters(): void {
    this.filterForm.reset({
      name: null,
      categories: null,
      isPersonal: false,
      calories: null,
      proteins: [SLIDER_MIN, SLIDER_MAX],
      carbs: [SLIDER_MIN, SLIDER_MAX],
      fats: [SLIDER_MIN, SLIDER_MAX],
      fibers: [SLIDER_MIN, SLIDER_MAX],
      sugars: [SLIDER_MIN, SLIDER_MAX],
      salt: [SLIDER_MIN, SLIDER_MAX],
    });
    this.applyFilters();
  }

  private buildForm(): FormGroup<FilterFormControls> {
    return this.fb.group<FilterFormControls>({
      name: this.fb.control<string | null>(null),
      categories: this.fb.control<string[] | null>(null),
      isPersonal: this.fb.nonNullable.control(false),
      calories: this.fb.control<CaloriesValue | null>(null),
      proteins: this.fb.nonNullable.control([SLIDER_MIN, SLIDER_MAX]),
      carbs: this.fb.nonNullable.control([SLIDER_MIN, SLIDER_MAX]),
      fats: this.fb.nonNullable.control([SLIDER_MIN, SLIDER_MAX]),
      fibers: this.fb.nonNullable.control([SLIDER_MIN, SLIDER_MAX]),
      sugars: this.fb.nonNullable.control([SLIDER_MIN, SLIDER_MAX]),
      salt: this.fb.nonNullable.control([SLIDER_MIN, SLIDER_MAX]),
    });
  }

  private buildRequest(): GetFoodsRequest {
    const value = this.filterForm.getRawValue();
    const request: GetFoodsRequest = {};

    const name = value.name?.trim();
    if (name) {
      request.name = name;
    }

    if (value.categories?.length) {
      request.categories = value.categories;
    }

    if (value.isPersonal) {
      request.isPersonal = true;
    }

    const nutrients: Nutrients = {};
    this.setRange(nutrients, 'calories', this.toRange(value.calories));
    this.setRange(nutrients, 'proteins', this.fromSlider(value.proteins));
    this.setRange(nutrients, 'carbs', this.fromSlider(value.carbs));
    this.setRange(nutrients, 'fats', this.fromSlider(value.fats));
    this.setRange(nutrients, 'fibers', this.fromSlider(value.fibers));
    this.setRange(nutrients, 'sugars', this.fromSlider(value.sugars));
    this.setRange(nutrients, 'salt', this.fromSlider(value.salt));

    if (Object.keys(nutrients).length > 0) {
      request.nutrients = nutrients;
    }

    return request;
  }

  private setRange(nutrients: Nutrients, key: NutrientKey, range: NutrientRange | null): void {
    if (range) {
      nutrients[key] = range;
    }
  }

  private toRange(value: CaloriesValue | null): NutrientRange | null {
    const min = value?.min ?? null;
    const max = value?.max ?? null;

    if (min === null && max === null) {
      return null;
    }

    return {
      ...(min !== null && { min }),
      ...(max !== null && { max }),
    };
  }

  private fromSlider(value: number[] | null): NutrientRange | null {
    const [min, max] = value ?? [];

    if (min === undefined || max === undefined) {
      return null;
    }

    if (min === SLIDER_MIN && max === SLIDER_MAX) {
      return null;
    }

    return { min, max };
  }
}
