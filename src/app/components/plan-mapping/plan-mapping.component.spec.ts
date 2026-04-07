import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMappingComponent } from './plan-mapping.component';

describe('PlanMappingComponent', () => {
  let component: PlanMappingComponent;
  let fixture: ComponentFixture<PlanMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
