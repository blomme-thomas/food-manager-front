import { TestBed } from '@angular/core/testing';
import { PlanningComponent } from '../planning.component';

describe('PlanningComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(PlanningComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
