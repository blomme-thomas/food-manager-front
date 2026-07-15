import { TestBed } from '@angular/core/testing';
import { AlimentsComponent } from './aliments.component';

describe('AlimentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlimentsComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(AlimentsComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
