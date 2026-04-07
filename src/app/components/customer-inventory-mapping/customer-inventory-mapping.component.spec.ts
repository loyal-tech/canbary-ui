import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInventoryMappingComponent } from './customer-inventory-mapping.component';

describe('CustomerInventoryMappingComponent', () => {
  let component: CustomerInventoryMappingComponent;
  let fixture: ComponentFixture<CustomerInventoryMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerInventoryMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInventoryMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
