import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';

import { atLeastOneNameValidator } from './create-food.validators';

function buildGroup(fr: string | null, en: string | null): FormGroup {
  return new FormGroup(
    {
      FR: new FormControl<string | null>(fr),
      EN: new FormControl<string | null>(en),
    },
    { validators: atLeastOneNameValidator() },
  );
}

describe('atLeastOneNameValidator', () => {
  it('should return an error when both FR and EN are empty', () => {
    const group = buildGroup(null, null);

    expect(group.errors).toEqual({ atLeastOneName: true });
  });

  it('should be valid when only FR is filled', () => {
    const group = buildGroup('Tomate', null);

    expect(group.errors).toBeNull();
  });

  it('should be valid when only EN is filled', () => {
    const group = buildGroup(null, 'Tomato');

    expect(group.errors).toBeNull();
  });

  it('should be valid when both FR and EN are filled', () => {
    const group = buildGroup('Tomate', 'Tomato');

    expect(group.errors).toBeNull();
  });

  it('should return an error when FR is whitespace only', () => {
    const group = buildGroup('   ', null);

    expect(group.errors).toEqual({ atLeastOneName: true });
  });

  it('should return an error when EN is whitespace only', () => {
    const group = buildGroup(null, '   ');

    expect(group.errors).toEqual({ atLeastOneName: true });
  });

  it('should return an error when both FR and EN are whitespace only', () => {
    const group = buildGroup('   ', '   ');

    expect(group.errors).toEqual({ atLeastOneName: true });
  });

  it('should be valid when FR has surrounding whitespace around real content', () => {
    const group = buildGroup('  Tomate  ', null);

    expect(group.errors).toBeNull();
  });
});
