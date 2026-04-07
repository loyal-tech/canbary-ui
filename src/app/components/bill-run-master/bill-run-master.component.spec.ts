import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillRunMasterComponent } from './bill-run-master.component';

describe('BillRunMasterComponent', () => {
  let component: BillRunMasterComponent;
  let fixture: ComponentFixture<BillRunMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillRunMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillRunMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
