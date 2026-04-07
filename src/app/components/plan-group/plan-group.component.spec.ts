import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanGroupComponent } from './plan-group.component';

describe('PlanGroupComponent', () => {
  let component: PlanGroupComponent;
  let fixture: ComponentFixture<PlanGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
