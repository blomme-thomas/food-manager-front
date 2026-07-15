import { TestBed } from '@angular/core/testing';
import { RecettesComponent } from './recettes.component';

describe('RecettesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecettesComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(RecettesComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
