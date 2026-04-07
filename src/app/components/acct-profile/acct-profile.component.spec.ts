import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctProfileComponent } from './acct-profile.component';

describe('AcctProfileComponent', () => {
  let component: AcctProfileComponent;
  let fixture: ComponentFixture<AcctProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcctProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
