import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { GetFoodsRequest } from '@core/api/requests/get-foods.request';
import { FoodResponse, PaginatedFoodResponse } from '@core/api/responses/food.response';
import { FoodService } from '@core/api/services/food.service';
import { UserService } from '@core/api/services/user.service';
import { LanguageService } from '@core/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';
import { FilterFormComponent } from '../forms/filter/filter.form';
import { CreateFoodComponent } from '../create/create-food';
import { TableComponent } from '@shared/components/table/table';
import { createFoodTableColumns } from '../../config/food-table.columns';

const DEFAULT_PAGE_SIZE = 10;

@Component({
  standalone: true,
  selector: 'app-foods',
  templateUrl: './foods.html',
  styleUrls: ['./foods.scss'],
  imports: [
    FilterFormComponent,
    TableComponent,
    TranslatePipe,
    AsyncPipe,
    NzButtonModule,
    NzModalModule,
    CreateFoodComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodsComponent implements OnInit {
  private readonly foodService = inject(FoodService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly languageService = inject(LanguageService);
  private readonly userService = inject(UserService);

  private currentFilters: GetFoodsRequest = {};

  public readonly columns = createFoodTableColumns(this.languageService);

  public readonly currentUser$ = this.userService.currentUser$;

  public readonly foods = signal<FoodResponse[]>([]);
  public readonly isLoading = signal(false);
  public readonly errorMessage = signal<string | null>(null);
  public readonly pageIndex = signal(1);
  public readonly pageSize = signal(DEFAULT_PAGE_SIZE);
  public readonly total = signal(0);
  public readonly hasNextPage = signal(false);
  public readonly isCreateModalVisible = signal(false);

  public ngOnInit(): void {
    this.loadFoods({});
  }

  public openCreateModal(): void {
    this.isCreateModalVisible.set(true);
  }

  public onFoodCreated(): void {
    this.isCreateModalVisible.set(false);
    this.fetchFoods();
  }

  public loadFoods(request: GetFoodsRequest): void {
    this.currentFilters = request;
    this.pageIndex.set(1);
    this.fetchFoods();
  }

  public onPageIndexChange(pageIndex: number): void {
    this.pageIndex.set(pageIndex);
    this.fetchFoods();
  }

  public onPageSizeChange(pageSize: number): void {
    this.pageSize.set(pageSize);
    this.pageIndex.set(1);
    this.fetchFoods();
  }

  private fetchFoods(): void {
    const take = this.pageSize();
    const skip = (this.pageIndex() - 1) * take;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.foodService
      .getFoods({ ...this.currentFilters, skip, take })
      .pipe(
        finalize((): void => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response: PaginatedFoodResponse): void => {
          this.foods.set(response.items);
          this.total.set(response.total);
          this.hasNextPage.set(skip + response.items.length < response.total);
        },
        error: (error: unknown): void => {
          console.error(error);
          this.foods.set([]);
          this.total.set(0);
          this.hasNextPage.set(false);
          this.errorMessage.set('ERRORS.GENERIC_MESSAGE');
        },
      });
  }
}
