import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctCdrComponent } from './acct-cdr.component';

describe('AcctCdrComponent', () => {
  let component: AcctCdrComponent;
  let fixture: ComponentFixture<AcctCdrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcctCdrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctCdrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
