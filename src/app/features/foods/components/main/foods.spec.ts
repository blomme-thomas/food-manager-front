import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GetFoodsRequest } from '@core/api/requests/get-foods.request';
import { FoodResponse, PaginatedFoodResponse } from '@core/api/responses/food.response';
import { UserResponse } from '@core/api/responses/user.response';
import { FoodService } from '@core/api/services/food.service';
import { UserService } from '@core/api/services/user.service';
import { provideTranslateService } from '@ngx-translate/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FoodsComponent } from './foods';

function paginatedResponse(items: FoodResponse[], total = items.length): PaginatedFoodResponse {
  return { items, total };
}

describe('FoodsComponent', () => {
  let component: FoodsComponent;
  let fixture: ComponentFixture<FoodsComponent>;

  let foodServiceMock: {
    getFoods: ReturnType<typeof vi.fn>;
    getCategories: ReturnType<typeof vi.fn>;
    getUnits: ReturnType<typeof vi.fn>;
  };

  let userServiceMock: {
    currentUser$: Observable<UserResponse | null>;
  };

  beforeEach(async () => {
    foodServiceMock = {
      getFoods: vi.fn().mockReturnValue(of(paginatedResponse([]))),
      getCategories: vi.fn().mockReturnValue(of([])),
      getUnits: vi.fn().mockReturnValue(of([])),
    };

    userServiceMock = {
      currentUser$: of(null),
    };

    await TestBed.configureTestingModule({
      imports: [FoodsComponent],
      providers: [
        provideTranslateService(),
        {
          provide: FoodService,
          useValue: foodServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
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

  it('should load all foods without filters when the component initializes', () => {
    expect(foodServiceMock.getFoods).toHaveBeenCalledWith({ skip: 0, take: 10 });
  });

  it('should request the foods matching the applied filters, paginated for the first page', () => {
    const request: GetFoodsRequest = { name: 'tomato' };

    foodServiceMock.getFoods.mockReturnValue(of(paginatedResponse([])));
    foodServiceMock.getFoods.mockClear();

    component.loadFoods(request);

    expect(foodServiceMock.getFoods).toHaveBeenCalledOnce();
    expect(foodServiceMock.getFoods).toHaveBeenCalledWith({ ...request, skip: 0, take: 10 });
  });

  it('should store the returned foods', () => {
    const foods = [{ id: 'food-id' }] as FoodResponse[];

    foodServiceMock.getFoods.mockReturnValue(of(paginatedResponse(foods)));

    component.loadFoods({});

    expect(component.foods()).toEqual(foods);
  });

  it('should enable loading while the foods are being fetched', () => {
    const foods$ = new Subject<PaginatedFoodResponse>();

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

  it('should mark that there is a next page when more foods remain beyond this page', () => {
    const foods = Array.from({ length: 10 }, (_, index) => ({
      id: `food-${index}`,
    })) as FoodResponse[];
    foodServiceMock.getFoods.mockReturnValue(of(paginatedResponse(foods, 15)));

    component.loadFoods({});

    expect(component.hasNextPage()).toBe(true);
  });

  it('should mark that there is no next page when this page reaches the total', () => {
    const foods = [{ id: 'food-id' }] as FoodResponse[];
    foodServiceMock.getFoods.mockReturnValue(of(paginatedResponse(foods, 1)));

    component.loadFoods({});

    expect(component.hasNextPage()).toBe(false);
  });

  it('should request the next page keeping the applied filters and page size', () => {
    const request: GetFoodsRequest = { name: 'tomato' };
    foodServiceMock.getFoods.mockReturnValue(of(paginatedResponse([])));
    component.loadFoods(request);

    component.onPageIndexChange(2);

    expect(component.pageIndex()).toBe(2);
    expect(foodServiceMock.getFoods).toHaveBeenLastCalledWith({ ...request, skip: 10, take: 10 });
  });

  it('should reset to the first page when the page size changes', () => {
    foodServiceMock.getFoods.mockReturnValue(of(paginatedResponse([])));
    component.loadFoods({});
    component.onPageIndexChange(3);

    component.onPageSizeChange(20);

    expect(component.pageIndex()).toBe(1);
    expect(component.pageSize()).toBe(20);
    expect(foodServiceMock.getFoods).toHaveBeenLastCalledWith({ skip: 0, take: 20 });
  });

  it('should show the create modal when openCreateModal is called', () => {
    expect(component.isCreateModalVisible()).toBe(false);

    component.openCreateModal();

    expect(component.isCreateModalVisible()).toBe(true);
  });

  it('should hide the create modal and refresh the food list when a food is created', () => {
    component.openCreateModal();
    foodServiceMock.getFoods.mockClear();

    component.onFoodCreated();

    expect(component.isCreateModalVisible()).toBe(false);
    expect(foodServiceMock.getFoods).toHaveBeenCalledOnce();
  });

  describe('create button visibility', () => {
    function findCreateButton(
      targetFixture: ComponentFixture<FoodsComponent>,
    ): HTMLButtonElement | undefined {
      const buttons = Array.from(
        targetFixture.nativeElement.querySelectorAll('button'),
      ) as HTMLButtonElement[];

      return buttons.find((button) => button.getAttribute('aria-label') === 'FOODS.CREATE.BUTTON');
    }

    async function createWithUser(
      user: UserResponse | null,
    ): Promise<ComponentFixture<FoodsComponent>> {
      TestBed.resetTestingModule();

      await TestBed.configureTestingModule({
        imports: [FoodsComponent],
        providers: [
          provideTranslateService(),
          {
            provide: FoodService,
            useValue: foodServiceMock,
          },
          {
            provide: UserService,
            useValue: { currentUser$: of(user) },
          },
        ],
      }).compileComponents();

      const localFixture = TestBed.createComponent(FoodsComponent);
      localFixture.detectChanges();
      return localFixture;
    }

    it('should show the create button for an admin user', async () => {
      const adminUser = { role: 'ADMIN' } as UserResponse;

      const localFixture = await createWithUser(adminUser);

      expect(findCreateButton(localFixture)).toBeTruthy();
    });

    it('should hide the create button for a non-admin user', async () => {
      const regularUser = { role: 'USER' } as UserResponse;

      const localFixture = await createWithUser(regularUser);

      expect(findCreateButton(localFixture)).toBeFalsy();
    });

    it('should hide the create button when there is no current user', async () => {
      const localFixture = await createWithUser(null);

      expect(findCreateButton(localFixture)).toBeFalsy();
    });
  });
});
