import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedReasonMasterComponent } from './rejected-reason-master.component';

describe('RejectedReasonMasterComponent', () => {
  let component: RejectedReasonMasterComponent;
  let fixture: ComponentFixture<RejectedReasonMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedReasonMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedReasonMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
