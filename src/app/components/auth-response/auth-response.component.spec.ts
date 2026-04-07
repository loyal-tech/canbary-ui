import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthResponseComponent } from './auth-response.component';

describe('AuthResponseComponent', () => {
  let component: AuthResponseComponent;
  let fixture: ComponentFixture<AuthResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
