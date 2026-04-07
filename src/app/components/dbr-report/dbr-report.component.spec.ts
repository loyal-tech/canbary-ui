import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbrReportComponent } from './dbr-report.component';

describe('DbrReportComponent', () => {
  let component: DbrReportComponent;
  let fixture: ComponentFixture<DbrReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbrReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DbrReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
