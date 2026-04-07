import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VasManagementComponent } from './vas-management.component';

describe('ChargeManagementComponent', () => {
  let component: VasManagementComponent;
  let fixture: ComponentFixture<VasManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VasManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VasManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
