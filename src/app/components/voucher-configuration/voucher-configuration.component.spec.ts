import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherConfigurationComponent } from './voucher-configuration.component';

describe('VoucherConfigurationComponent', () => {
  let component: VoucherConfigurationComponent;
  let fixture: ComponentFixture<VoucherConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
