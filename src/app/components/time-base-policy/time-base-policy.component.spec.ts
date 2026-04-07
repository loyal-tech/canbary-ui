import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeBasePolicyComponent } from './time-base-policy.component';

describe('TimeBasePolicyComponent', () => {
  let component: TimeBasePolicyComponent;
  let fixture: ComponentFixture<TimeBasePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeBasePolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeBasePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
