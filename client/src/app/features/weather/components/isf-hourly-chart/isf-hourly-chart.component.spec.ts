import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsfHourlyChartComponent } from './isf-hourly-chart.component';

describe('IsfHourlyChartComponent', () => {
  let component: IsfHourlyChartComponent;
  let fixture: ComponentFixture<IsfHourlyChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsfHourlyChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfHourlyChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
