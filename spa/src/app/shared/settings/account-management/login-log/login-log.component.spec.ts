import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginLogComponent } from './login-log.component';

describe('LoginLogComponent', () => {
  let component: LoginLogComponent;
  let fixture: ComponentFixture<LoginLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
