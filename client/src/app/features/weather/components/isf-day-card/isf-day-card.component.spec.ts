import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsfDayCardComponent } from './isf-day-card.component';

describe('IsfDayCardComponent', () => {
  let component: IsfDayCardComponent;
  let fixture: ComponentFixture<IsfDayCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsfDayCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfDayCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
