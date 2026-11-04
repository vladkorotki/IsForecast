import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsfWeatherDetailsComponent } from './isf-weather-details.component';

describe('IsfWeatherDetailsComponent', () => {
  let component: IsfWeatherDetailsComponent;
  let fixture: ComponentFixture<IsfWeatherDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsfWeatherDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfWeatherDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
