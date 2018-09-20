import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestRegistrationComponent } from './request-registration.component';

describe('RequestRegistrationComponent', () => {
  let component: RequestRegistrationComponent;
  let fixture: ComponentFixture<RequestRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
