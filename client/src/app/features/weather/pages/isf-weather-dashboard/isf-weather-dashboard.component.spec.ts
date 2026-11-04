import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsfWeatherDashboardComponent } from './isf-weather-dashboard.component';

describe('IsfWeatherDashboardComponent', () => {
  let component: IsfWeatherDashboardComponent;
  let fixture: ComponentFixture<IsfWeatherDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsfWeatherDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfWeatherDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
