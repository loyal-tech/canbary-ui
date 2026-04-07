import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacasManagementComponent } from './tacas-management.component';

describe('TacasManagementComponent', () => {
  let component: TacasManagementComponent;
  let fixture: ComponentFixture<TacasManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TacasManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TacasManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
