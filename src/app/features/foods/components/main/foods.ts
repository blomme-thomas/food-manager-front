import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GetFoodsRequest } from '@core/api/requests/get-foods.request';
import { FoodResponse } from '@core/api/responses/food.response';
import { FoodService } from '@core/api/services/food.service';
import { finalize } from 'rxjs';
import { FilterFormComponent } from '../forms/filter/filter.form';

@Component({
  standalone: true,
  selector: 'app-foods',
  templateUrl: './foods.html',
  styleUrls: ['./foods.scss'],
  imports: [FilterFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodsComponent {
  private readonly foodService = inject(FoodService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly foods = signal<FoodResponse[]>([]);
  public readonly isLoading = signal(false);
  public readonly errorMessage = signal<string | null>(null);

  public loadFoods(request: GetFoodsRequest): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.foodService
      .getFoods(request)
      .pipe(
        finalize((): void => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (foods: FoodResponse[]): void => {
          this.foods.set(foods);
          console.log('Foods loaded:', foods);
        },
        error: (error: unknown): void => {
          console.error(error);
          this.foods.set([]);
          this.errorMessage.set('ERRORS.GENERIC_MESSAGE');
        },
      });
  }
}
