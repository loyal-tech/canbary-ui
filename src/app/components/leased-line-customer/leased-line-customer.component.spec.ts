import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasedLineCustomerComponent } from './leased-line-customer.component';

describe('LeasedLineCustomerComponent', () => {
  let component: LeasedLineCustomerComponent;
  let fixture: ComponentFixture<LeasedLineCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeasedLineCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeasedLineCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
