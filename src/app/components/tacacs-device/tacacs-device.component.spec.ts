import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacacsDeviceComponent } from './tacacs-device.component';

describe('TacacsDeviceComponent', () => {
  let component: TacacsDeviceComponent;
  let fixture: ComponentFixture<TacacsDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TacacsDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TacacsDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
