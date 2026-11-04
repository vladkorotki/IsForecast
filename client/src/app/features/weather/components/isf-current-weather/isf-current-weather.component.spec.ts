import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsfCurrentWeatherComponent } from './isf-current-weather.component';

describe('IsfCurrentWeatherComponent', () => {
  let component: IsfCurrentWeatherComponent;
  let fixture: ComponentFixture<IsfCurrentWeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsfCurrentWeatherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfCurrentWeatherComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
