import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacacsDeviceGroupComponent } from './tacacs-device-group.component';

describe('TacacsDeviceGroupComponent', () => {
  let component: TacacsDeviceGroupComponent;
  let fixture: ComponentFixture<TacacsDeviceGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TacacsDeviceGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TacacsDeviceGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
