import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordCreateComponent } from './password-create.component';

describe('PasswordCreateComponent', () => {
  let component: PasswordCreateComponent;
  let fixture: ComponentFixture<PasswordCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
