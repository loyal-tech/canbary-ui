import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkDeviceComponent } from './network-device.component';

describe('NetworkDeviceComponent', () => {
  let component: NetworkDeviceComponent;
  let fixture: ComponentFixture<NetworkDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
