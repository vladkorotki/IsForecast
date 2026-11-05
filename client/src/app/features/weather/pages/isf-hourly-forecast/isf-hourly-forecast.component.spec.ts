import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsfHourlyForecastComponent } from './isf-hourly-forecast.component';

describe('IsfHourlyForecastComponent', () => {
  let component: IsfHourlyForecastComponent;
  let fixture: ComponentFixture<IsfHourlyForecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsfHourlyForecastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfHourlyForecastComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
