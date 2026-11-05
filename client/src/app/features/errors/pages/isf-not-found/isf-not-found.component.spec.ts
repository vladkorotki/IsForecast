import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsfNotFoundComponent } from './isf-not-found.component';

describe('IsfNotFoundComponent', () => {
  let component: IsfNotFoundComponent;
  let fixture: ComponentFixture<IsfNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsfNotFoundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfNotFoundComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
