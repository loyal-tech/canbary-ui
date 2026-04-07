import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionMasterComponent } from './resolution-master.component';

describe('ResolutionMasterComponent', () => {
  let component: ResolutionMasterComponent;
  let fixture: ComponentFixture<ResolutionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResolutionMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
