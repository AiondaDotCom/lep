import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeratorRoutingModule } from './moderator-routing.module';

import { DashboardModule } from '../shared/dashboard/dashboard.module';
import { SettingsModule } from '../shared/settings/settings.module';

import { ModeratorComponent } from './moderator.component';
import { ModeratorDashboardComponent } from './moderator-dashboard/moderator-dashboard.component';
import { ModeratorSettingsComponent } from './moderator-settings/moderator-settings.component';

@NgModule({
  imports: [
    CommonModule,
    ModeratorRoutingModule,
    DashboardModule,
    SettingsModule
  ],
  declarations: [
    ModeratorComponent,
    ModeratorDashboardComponent,
    ModeratorSettingsComponent
  ]
})
export class ModeratorModule { }
