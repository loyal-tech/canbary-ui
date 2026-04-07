import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiusRoleComponent } from './radius-role.component';

describe('RadiusRoleComponent', () => {
  let component: RadiusRoleComponent;
  let fixture: ComponentFixture<RadiusRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadiusRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiusRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
