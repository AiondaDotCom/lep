import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorSettingsComponent } from './moderator-settings.component';

describe('ModeratorSettingsComponent', () => {
  let component: ModeratorSettingsComponent;
  let fixture: ComponentFixture<ModeratorSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeratorSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeratorSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
