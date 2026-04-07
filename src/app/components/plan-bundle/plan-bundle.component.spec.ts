import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanBundleComponent } from './plan-bundle.component';

describe('PlanBundleComponent', () => {
  let component: PlanBundleComponent;
  let fixture: ComponentFixture<PlanBundleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanBundleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanBundleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
