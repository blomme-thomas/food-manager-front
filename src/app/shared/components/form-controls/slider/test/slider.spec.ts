import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

import { SliderComponent } from '../slider';

describe('SliderComponent', () => {
  let component: SliderComponent;
  let fixture: ComponentFixture<SliderComponent>;

  const inputs = (): HTMLInputElement[] =>
    fixture.debugElement
      .queryAll(By.css('.slider-value-input'))
      .map((element) => element.nativeElement as HTMLInputElement);

  const enter = (index: number, value: string): void => {
    const input = inputs()[index];

    input.value = value;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl([0, 100]);
    fixture.detectChanges();
  });

  it('should display the value of the control', () => {
    component.formControl.setValue([10, 60]);
    fixture.detectChanges();

    expect(inputs().map((input) => input.value)).toEqual(['10', '60']);
  });

  it('should apply an entered value to the control', () => {
    enter(0, '25');

    expect(component.formControl.value).toEqual([25, 100]);
  });

  it('should clamp an entry above the maximum', () => {
    enter(1, '150');

    expect(component.formControl.value).toEqual([0, 100]);
    expect(inputs()[1].value).toBe('100');
  });

  it('should clamp an entry below the minimum', () => {
    enter(0, '-20');

    expect(component.formControl.value).toEqual([0, 100]);
  });

  it('should not let the minimum go past the current maximum', () => {
    component.formControl.setValue([0, 40]);
    fixture.detectChanges();

    enter(0, '70');

    expect(component.formControl.value).toEqual([40, 40]);
  });

  it('should not let the maximum go below the current minimum', () => {
    component.formControl.setValue([30, 100]);
    fixture.detectChanges();

    enter(1, '10');

    expect(component.formControl.value).toEqual([30, 30]);
  });

  it('should keep the current value when the entry is empty', () => {
    component.formControl.setValue([20, 80]);
    fixture.detectChanges();

    enter(0, '');

    expect(component.formControl.value).toEqual([20, 80]);
    expect(inputs()[0].value).toBe('20');
  });
});
