import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodService } from '@core/api/services/food.service';
import { FoodResponse } from '@core/api/responses/food.response';
import { provideTranslateService } from '@ngx-translate/core';
import { Subject, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CreateFoodComponent } from '../create-food';

interface CreateFoodFormValue {
  name: { FR: string | null; EN: string | null };
  baseUnitCode: string | null;
  caloriesPer100: number | null;
  proteinsPer100: number | null;
  carbsPer100: number | null;
  fatsPer100: number | null;
  fibersPer100: number | null;
  sugarsPer100: number | null;
  saltPer100: number | null;
}

function validFormValue(): CreateFoodFormValue {
  return {
    name: { FR: 'Tomate', EN: 'Tomato' },
    baseUnitCode: 'g',
    caloriesPer100: 20,
    proteinsPer100: 1,
    carbsPer100: 4,
    fatsPer100: 0,
    fibersPer100: null,
    sugarsPer100: null,
    saltPer100: null,
  };
}

describe('CreateFoodComponent', () => {
  let component: CreateFoodComponent;
  let fixture: ComponentFixture<CreateFoodComponent>;

  let foodServiceMock: {
    getUnits: ReturnType<typeof vi.fn>;
    createFood: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    foodServiceMock = {
      getUnits: vi.fn().mockReturnValue(of(['g', 'ml'])),
      createFood: vi.fn().mockReturnValue(of({} as FoodResponse)),
    };

    await TestBed.configureTestingModule({
      imports: [CreateFoodComponent],
      providers: [
        provideTranslateService(),
        {
          provide: FoodService,
          useValue: foodServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should request the available units from the food service', () => {
      expect(foodServiceMock.getUnits).toHaveBeenCalledOnce();
    });

    it('should populate the unit select options from the returned units', () => {
      expect(component.unitOptions).toEqual([
        { label: { FR: 'g', EN: 'g' }, value: 'g' },
        { label: { FR: 'ml', EN: 'ml' }, value: 'ml' },
      ]);
    });
  });

  describe('invalid submission', () => {
    it('should not call createFood and should mark the form as submitted when both names are empty', () => {
      component.submit();

      expect(foodServiceMock.createFood).not.toHaveBeenCalled();
      expect(component.submitted()).toBe(true);
    });

    it('should mark every control as touched so validation errors become visible', () => {
      expect(component.createForm.controls.name.controls.FR.touched).toBe(false);

      component.submit();

      expect(component.createForm.touched).toBe(true);
      expect(component.createForm.controls.name.controls.FR.touched).toBe(true);
      expect(component.createForm.controls.name.controls.EN.touched).toBe(true);
      expect(component.createForm.controls.baseUnitCode.touched).toBe(true);
    });

    it('should mark the form invalid when a required macro is missing', () => {
      component.createForm.setValue({ ...validFormValue(), caloriesPer100: null });

      component.submit();

      expect(component.createForm.invalid).toBe(true);
      expect(foodServiceMock.createFood).not.toHaveBeenCalled();
    });

    it('should mark the form invalid when a macro value is negative', () => {
      component.createForm.setValue({ ...validFormValue(), proteinsPer100: -1 });

      component.submit();

      expect(component.createForm.invalid).toBe(true);
      expect(foodServiceMock.createFood).not.toHaveBeenCalled();
    });

    it('should mark the form invalid when a macro value exceeds the documented maximum', () => {
      component.createForm.setValue({ ...validFormValue(), carbsPer100: 101 });

      component.submit();

      expect(component.createForm.invalid).toBe(true);
      expect(foodServiceMock.createFood).not.toHaveBeenCalled();
    });

    it('should mark the form invalid when calories exceed their own documented maximum', () => {
      component.createForm.setValue({ ...validFormValue(), caloriesPer100: 1001 });

      component.submit();

      expect(component.createForm.invalid).toBe(true);
      expect(foodServiceMock.createFood).not.toHaveBeenCalled();
    });
  });

  describe('valid submission', () => {
    it('should call createFood with only the FR key when only the FR name is filled', () => {
      component.createForm.setValue({ ...validFormValue(), name: { FR: 'Tomate', EN: null } });

      component.submit();

      expect(foodServiceMock.createFood).toHaveBeenCalledOnce();
      const request = foodServiceMock.createFood.mock.calls[0][0];
      expect(request.name).toEqual({ FR: 'Tomate' });
      expect('EN' in request.name).toBe(false);
    });

    it('should call createFood with only the EN key when only the EN name is filled', () => {
      component.createForm.setValue({ ...validFormValue(), name: { FR: null, EN: 'Tomato' } });

      component.submit();

      expect(foodServiceMock.createFood).toHaveBeenCalledOnce();
      const request = foodServiceMock.createFood.mock.calls[0][0];
      expect(request.name).toEqual({ EN: 'Tomato' });
      expect('FR' in request.name).toBe(false);
    });

    it('should call createFood with both keys when both names are filled', () => {
      component.createForm.setValue(validFormValue());

      component.submit();

      expect(foodServiceMock.createFood).toHaveBeenCalledOnce();
      const request = foodServiceMock.createFood.mock.calls[0][0];
      expect(request.name).toEqual({ FR: 'Tomate', EN: 'Tomato' });
    });

    it('should omit optional nutrient fields from the request when they are left empty', () => {
      component.createForm.setValue(validFormValue());

      component.submit();

      const request = foodServiceMock.createFood.mock.calls[0][0];
      expect('fibersPer100' in request).toBe(false);
      expect('sugarsPer100' in request).toBe(false);
      expect('saltPer100' in request).toBe(false);
    });

    it('should include optional nutrient fields in the request when they are provided', () => {
      component.createForm.setValue({
        ...validFormValue(),
        fibersPer100: 5,
        sugarsPer100: 3,
        saltPer100: 1,
      });

      component.submit();

      const request = foodServiceMock.createFood.mock.calls[0][0];
      expect(request.fibersPer100).toBe(5);
      expect(request.sugarsPer100).toBe(3);
      expect(request.saltPer100).toBe(1);
    });

    it('should emit created after a successful create', () => {
      const emitted: void[] = [];
      component.created.subscribe(() => emitted.push(undefined));

      component.createForm.setValue(validFormValue());
      component.submit();

      expect(emitted.length).toBe(1);
    });

    it('should toggle isLoading on while the request is in flight and off once it completes', () => {
      const create$ = new Subject<FoodResponse>();
      foodServiceMock.createFood.mockReturnValue(create$.asObservable());

      component.createForm.setValue(validFormValue());
      component.submit();

      expect(component.isLoading()).toBe(true);

      create$.next({} as FoodResponse);
      create$.complete();

      expect(component.isLoading()).toBe(false);
    });

    it('should set a generic error message and stop loading when createFood fails', () => {
      foodServiceMock.createFood.mockReturnValue(throwError(() => new Error('Request failed')));
      vi.spyOn(console, 'error').mockImplementation(() => undefined);

      component.createForm.setValue(validFormValue());
      component.submit();

      expect(component.errorMessage()).toBe('ERRORS.GENERIC_MESSAGE');
      expect(component.isLoading()).toBe(false);
    });

    it('should not emit created when createFood fails', () => {
      foodServiceMock.createFood.mockReturnValue(throwError(() => new Error('Request failed')));
      vi.spyOn(console, 'error').mockImplementation(() => undefined);

      const emitted: void[] = [];
      component.created.subscribe(() => emitted.push(undefined));

      component.createForm.setValue(validFormValue());
      component.submit();

      expect(emitted.length).toBe(0);
    });
  });
});
