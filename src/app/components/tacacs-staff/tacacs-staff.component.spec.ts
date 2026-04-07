import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacacsStaffComponent } from './tacacs-staff.component';

describe('TacacsStaffComponent', () => {
  let component: TacacsStaffComponent;
  let fixture: ComponentFixture<TacacsStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TacacsStaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TacacsStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
