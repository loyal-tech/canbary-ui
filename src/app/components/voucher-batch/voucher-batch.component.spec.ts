import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherBatchComponent } from './voucher-batch.component';

describe('VoucherBatchComponent', () => {
  let component: VoucherBatchComponent;
  let fixture: ComponentFixture<VoucherBatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherBatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
