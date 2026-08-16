import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';

import { TableColumn, TableComponent } from './table';

interface Row {
  id: string;
  name: string;
  calories: number;
}

describe('TableComponent', () => {
  let component: TableComponent<Row>;
  let fixture: ComponentFixture<TableComponent<Row>>;

  const columns: TableColumn<Row>[] = [
    { key: 'name', label: 'Name' },
    { key: 'calories', label: 'Calories', render: (row) => `${row.calories} kcal` },
  ];

  const headerTexts = (): string[] =>
    fixture.debugElement
      .queryAll(By.css('thead th'))
      .map((element) => (element.nativeElement as HTMLElement).textContent?.trim() ?? '');

  const rowTexts = (): string[][] =>
    fixture.debugElement
      .queryAll(By.css('tbody tr:not(.ant-table-placeholder)'))
      .map((row) =>
        row
          .queryAll(By.css('td'))
          .map((cell) => (cell.nativeElement as HTMLElement).textContent?.trim() ?? ''),
      );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent<Row>);
    component = fixture.componentInstance;
    component.columns = columns;
  });

  it('should render one column header per configured column', () => {
    component.data = [];
    fixture.detectChanges();

    expect(headerTexts()).toEqual(['Name', 'Calories']);
  });

  it('should render a row per data entry, using the render function when provided', () => {
    component.data = [{ id: '1', name: 'Apple', calories: 52 }];
    fixture.detectChanges();

    expect(rowTexts()).toEqual([['Apple', '52 kcal']]);
  });

  it('should limit rows shown to the configured page size', () => {
    component.pageSize = 2;
    component.data = [
      { id: '1', name: 'Apple', calories: 52 },
      { id: '2', name: 'Banana', calories: 89 },
      { id: '3', name: 'Carrot', calories: 41 },
    ];
    fixture.detectChanges();

    expect(rowTexts().length).toBe(2);
  });

  it('should show no rows when the data is empty', () => {
    component.data = [];
    fixture.detectChanges();

    expect(rowTexts()).toEqual([]);
  });

  describe('server pagination mode', () => {
    const previousButton = (): HTMLButtonElement =>
      fixture.debugElement.queryAll(By.css('.table-pager__nav button'))[0]
        .nativeElement as HTMLButtonElement;

    const nextButton = (): HTMLButtonElement =>
      fixture.debugElement.queryAll(By.css('.table-pager__nav button'))[1]
        .nativeElement as HTMLButtonElement;

    beforeEach(() => {
      component.paginationMode = 'server';
      component.data = [{ id: '1', name: 'Apple', calories: 52 }];
    });

    it('should disable the previous button on the first page', () => {
      component.pageIndex = 1;
      fixture.detectChanges();

      expect(previousButton().disabled).toBe(true);
    });

    it('should enable the previous button past the first page', () => {
      component.pageIndex = 2;
      fixture.detectChanges();

      expect(previousButton().disabled).toBe(false);
    });

    it('should disable the next button when there is no next page', () => {
      component.hasNextPage = false;
      fixture.detectChanges();

      expect(nextButton().disabled).toBe(true);
    });

    it('should emit pageIndexChange with the next page index', () => {
      const emitted: number[] = [];
      component.pageIndex = 1;
      component.pageIndexChange.subscribe((value) => emitted.push(value));
      fixture.detectChanges();

      nextButton().click();

      expect(emitted).toEqual([2]);
    });

    it('should emit pageIndexChange with the previous page index', () => {
      const emitted: number[] = [];
      component.pageIndex = 2;
      component.pageIndexChange.subscribe((value) => emitted.push(value));
      fixture.detectChanges();

      previousButton().click();

      expect(emitted).toEqual([1]);
    });

    it('should emit pageSizeChange when the page size selection changes', () => {
      const emitted: number[] = [];
      component.pageSizeChange.subscribe((value) => emitted.push(value));
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('.table-pager__size'))
        .nativeElement as HTMLSelectElement;
      select.value = '20';
      select.dispatchEvent(new Event('change'));

      expect(emitted).toEqual([20]);
    });
  });
});
