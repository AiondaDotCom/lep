import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';

import { SettingsComponent } from './settings.component';
import { AccountManagementComponent } from './account-management/account-management.component';

import { LoadingIndicatorModule } from '../../loading-indicator/loading-indicator.module';
import { LoginLogComponent } from './account-management/login-log/login-log.component';

@NgModule({
  imports: [
    CommonModule,
    MomentModule,
    LoadingIndicatorModule
  ],
  exports: [
    SettingsComponent,
    AccountManagementComponent
  ],
  declarations: [
    SettingsComponent,
    AccountManagementComponent,
    LoginLogComponent
  ]
})

export class SettingsModule { }
