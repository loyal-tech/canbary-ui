import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedInventoryComponent } from './assigned-inventory.component';

describe('AssignedInventoryComponent', () => {
  let component: AssignedInventoryComponent;
  let fixture: ComponentFixture<AssignedInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedInventoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
