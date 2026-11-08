import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsfDailyForecastComponent } from './isf-daily-forecast.component';

describe('IsfDailyForecastComponent', () => {
  let component: IsfDailyForecastComponent;
  let fixture: ComponentFixture<IsfDailyForecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsfDailyForecastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfDailyForecastComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
