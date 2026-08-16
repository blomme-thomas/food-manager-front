import { FoodResponse } from '@core/api/responses/food.response';
import { LanguageService } from '@core/services/language.service';
import { TableColumn } from '@shared/components/table/table';

export function createFoodTableColumns(
  languageService: LanguageService,
): TableColumn<FoodResponse>[] {
  const lang = (): 'EN' | 'FR' => (languageService.getCurrentLanguage() === 'fr' ? 'FR' : 'EN');

  return [
    { key: 'name', label: 'TABLE.FOODS.NAME', render: (row) => row.name[lang()], width: '18%' },
    {
      key: 'category',
      label: 'FOODS.FORM.CATEGORY',
      render: (row) => row.category.name[lang()],
      width: '13%',
    },
    { key: 'caloriesPer100', label: 'FOODS.FORM.CALORIES_PER100', width: '9%' },
    { key: 'proteinsPer100', label: 'FOODS.FORM.PROTEIN_PER100', width: '9%' },
    { key: 'carbsPer100', label: 'FOODS.FORM.CARBS_PER100', width: '9%' },
    { key: 'fatsPer100', label: 'FOODS.FORM.FAT_PER100', width: '9%' },
    {
      key: 'fibersPer100',
      label: 'FOODS.FORM.FIBER_PER100',
      render: (row) => row.fibersPer100 ?? '—',
      width: '9%',
    },
    {
      key: 'sugarsPer100',
      label: 'FOODS.FORM.SUGAR_PER100',
      render: (row) => row.sugarsPer100 ?? '—',
      width: '9%',
    },
    {
      key: 'saltPer100',
      label: 'FOODS.FORM.SALT_PER100',
      render: (row) => row.saltPer100 ?? '—',
      width: '9%',
    },
    { key: 'baseUnit', label: 'TABLE.FOODS.BASE_UNIT', width: '6%' },
  ];
}
