import { ChangeDetectionStrategy, Component, Input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => string | number;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.html',
  styleUrls: ['./table.scss'],
  standalone: true,
  imports: [NzTableModule, NzButtonModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> {
  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() loading = false;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [10, 20, 50];
  @Input() trackByKey?: string;
  @Input() paginationMode: 'client' | 'server' = 'client';
  @Input() pageIndex = 1;
  @Input() hasNextPage = true;

  readonly pageIndexChange = output<number>();
  readonly pageSizeChange = output<number>();

  cellValue(row: T, column: TableColumn<T>): string | number {
    if (column.render) {
      return column.render(row);
    }

    const value = (row as Record<string, unknown>)[column.key];
    return value == null ? '' : String(value);
  }

  trackByRow = (index: number, row: T): unknown => {
    if (this.trackByKey) {
      return (row as Record<string, unknown>)[this.trackByKey];
    }

    return index;
  };

  onPreviousPage(): void {
    if (this.pageIndex > 1) {
      this.pageIndexChange.emit(this.pageIndex - 1);
    }
  }

  onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndexChange.emit(this.pageIndex + 1);
    }
  }

  onPageSizeSelect(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageSizeChange.emit(value);
  }
}
