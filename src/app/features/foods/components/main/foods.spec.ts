import { TestBed } from '@angular/core/testing';
import { FoodsComponent } from './foods';

describe('FoodsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodsComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(FoodsComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
