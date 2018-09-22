import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountManagerComponent } from './admin-account-manager.component';

describe('AdminAccountManagerComponent', () => {
  let component: AdminAccountManagerComponent;
  let fixture: ComponentFixture<AdminAccountManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccountManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccountManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
