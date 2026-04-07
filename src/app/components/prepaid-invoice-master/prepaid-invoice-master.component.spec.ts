import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepaidInvoiceMasterComponent } from './prepaid-invoice-master.component';

describe('PrepaidInvoiceMasterComponent', () => {
  let component: PrepaidInvoiceMasterComponent;
  let fixture: ComponentFixture<PrepaidInvoiceMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepaidInvoiceMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepaidInvoiceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
