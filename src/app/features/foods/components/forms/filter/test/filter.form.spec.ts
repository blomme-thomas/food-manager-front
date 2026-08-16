import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GetFoodsRequest } from '@core/api/requests/get-foods.request';
import { FoodService } from '@core/api/services/food.service';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FilterFormComponent } from '../filter.form';

describe('FilterFormComponent', () => {
  let component: FilterFormComponent;
  let fixture: ComponentFixture<FilterFormComponent>;

  let foodServiceMock: {
    getFoods: ReturnType<typeof vi.fn>;
    getCategories: ReturnType<typeof vi.fn>;
  };

  const emittedRequest = (): GetFoodsRequest => {
    const emitted: GetFoodsRequest[] = [];
    component.filtersApply.subscribe((request) => emitted.push(request));
    component.applyFilters();

    return emitted[0];
  };

  beforeEach(async () => {
    foodServiceMock = {
      getFoods: vi.fn(),
      getCategories: vi.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [FilterFormComponent],
      providers: [
        provideTranslateService(),
        {
          provide: FoodService,
          useValue: foodServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit an empty request when no filter is set', () => {
    expect(emittedRequest()).toEqual({});
  });

  it('should emit the filters set by the user', () => {
    component.filterForm.patchValue({
      name: '  tomato  ',
      categories: ['Légumes'],
      calories: { min: 10, max: null },
      proteins: [20, 80],
    });

    expect(emittedRequest()).toEqual({
      name: 'tomato',
      categories: ['Légumes'],
      nutrients: {
        calories: { min: 10 },
        proteins: { min: 20, max: 80 },
      },
    });
  });

  it('should ignore a slider left on its full range', () => {
    component.filterForm.patchValue({ carbs: [0, 100] });

    expect(emittedRequest()).toEqual({});
  });

  it('should emit an empty request after a reset', () => {
    const emitted: GetFoodsRequest[] = [];
    component.filtersApply.subscribe((request) => emitted.push(request));

    component.filterForm.patchValue({ name: 'tomato', fats: [5, 40] });
    component.resetFilters();

    expect(emitted).toEqual([{}]);
    expect(component.filterForm.controls.name.value).toBeNull();
    expect(component.filterForm.controls.fats.value).toEqual([0, 100]);
  });
});
