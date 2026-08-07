import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FoodService } from '@core/api/services/food.service';
import { TranslatePipe } from '@ngx-translate/core';
import { InputFieldComponent } from '@shared/components/form-controls/input-field/input-field';
import {
  InputSelectComponent,
  SelectOption,
} from '@shared/components/form-controls/input-select/input-select';
import { SliderComponent } from '@shared/components/form-controls/slider/slider';
import { InputRangeComponent } from '@shared/components/form-controls/input-range/input-range';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter.form.html',
  styleUrls: ['./filter.form.scss'],
  standalone: true,
  imports: [
    SliderComponent,
    InputFieldComponent,
    InputSelectComponent,
    TranslatePipe,
    InputRangeComponent,
    NzCollapseModule,
  ],
})
export class FilterFormComponent implements OnInit {
  fb = inject(FormBuilder);
  foodsService = inject(FoodService);
  categoryOptions: SelectOption[] = [];
  filterForm!: FormGroup;

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

      console.log('Category options:', this.categoryOptions);
    });

    console.log('FilterFormComponent initialized');
    this.filterForm = this.fb.group({
      name: [null],
      categories: [null],
      isPersonal: [false],
      calories: [null],
      proteins: [{ min: 0, max: 100 }],
      carbs: [{ min: 0, max: 100 }],
      fats: [{ min: 0, max: 100 }],
      fibers: [{ min: 0, max: 100 }],
      sugars: [{ min: 0, max: 100 }],
      salt: [{ min: 0, max: 100 }],
    });
  }
}
