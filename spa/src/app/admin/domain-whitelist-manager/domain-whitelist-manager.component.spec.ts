import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainWhitelistManagerComponent } from './domain-whitelist-manager.component';

describe('DomainWhitelistManagerComponent', () => {
  let component: DomainWhitelistManagerComponent;
  let fixture: ComponentFixture<DomainWhitelistManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainWhitelistManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainWhitelistManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
