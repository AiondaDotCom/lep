import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';

import { DashboardModule } from '../shared/dashboard/dashboard.module';
import { SettingsModule } from '../shared/settings/settings.module';

import { UserComponent } from './user.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    DashboardModule,
    SettingsModule
  ],
  declarations: [
    UserComponent,
    UserDashboardComponent,
    UserSettingsComponent
  ]
})
export class UserModule { }
