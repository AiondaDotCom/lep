import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorDashboardComponent } from './moderator-dashboard.component';

describe('ModeratorDashboardComponent', () => {
  let component: ModeratorDashboardComponent;
  let fixture: ComponentFixture<ModeratorDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeratorDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeratorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
