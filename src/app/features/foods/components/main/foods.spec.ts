import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GetFoodsRequest } from '@core/api/requests/get-foods.request';
import { FoodResponse } from '@core/api/responses/food.response';
import { FoodService } from '@core/api/services/food.service';
import { provideTranslateService } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FoodsComponent } from './foods';

describe('FoodsComponent', () => {
  let component: FoodsComponent;
  let fixture: ComponentFixture<FoodsComponent>;

  let foodServiceMock: {
    getFoods: ReturnType<typeof vi.fn>;
    getCategories: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    foodServiceMock = {
      getFoods: vi.fn(),
      getCategories: vi.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [FoodsComponent],
      providers: [
        provideTranslateService(),
        {
          provide: FoodService,
          useValue: foodServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should request the foods matching the applied filters', () => {
    const request: GetFoodsRequest = { name: 'tomato' };

    foodServiceMock.getFoods.mockReturnValue(of([]));

    component.loadFoods(request);

    expect(foodServiceMock.getFoods).toHaveBeenCalledOnce();
    expect(foodServiceMock.getFoods).toHaveBeenCalledWith(request);
  });

  it('should store the returned foods', () => {
    const foods = [{ id: 'food-id' }] as FoodResponse[];

    foodServiceMock.getFoods.mockReturnValue(of(foods));

    component.loadFoods({});

    expect(component.foods()).toEqual(foods);
  });

  it('should enable loading while the foods are being fetched', () => {
    const foods$ = new Subject<FoodResponse[]>();

    foodServiceMock.getFoods.mockReturnValue(foods$.asObservable());

    component.loadFoods({});

    expect(component.isLoading()).toBe(true);

    foods$.complete();

    expect(component.isLoading()).toBe(false);
  });

  it('should display a generic error when the request fails', () => {
    foodServiceMock.getFoods.mockReturnValue(throwError(() => new Error('Request failed')));

    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    component.loadFoods({});

    expect(component.errorMessage()).toBe('ERRORS.GENERIC_MESSAGE');
    expect(component.foods()).toEqual([]);
    expect(component.isLoading()).toBe(false);
  });
});
