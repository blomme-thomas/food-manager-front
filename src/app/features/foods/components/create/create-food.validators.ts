import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function atLeastOneNameValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fr = (group.get('FR')?.value as string | null)?.trim();
    const en = (group.get('EN')?.value as string | null)?.trim();
    return fr || en ? null : { atLeastOneName: true };
  };
}
