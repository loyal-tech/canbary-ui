import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacacsAuthenticationAuditComponent } from './tacacs-authentication-audit.component';

describe('TacacsAuthenticationAuditComponent', () => {
  let component: TacacsAuthenticationAuditComponent;
  let fixture: ComponentFixture<TacacsAuthenticationAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TacacsAuthenticationAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TacacsAuthenticationAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
