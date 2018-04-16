import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';

import { SettingsComponent } from './settings.component';
import { AccountManagementComponent } from './account-management/account-management.component';

import { LoadingIndicatorModule } from '../../loading-indicator/loading-indicator.module';
import { LoginLogComponent } from './account-management/login-log/login-log.component';
import { EditUserModule } from '../../shared/edit-user/edit-user.module';


@NgModule({
  imports: [
    CommonModule,
    MomentModule,
    LoadingIndicatorModule,
    EditUserModule
  ],
  exports: [
    SettingsComponent,
    AccountManagementComponent
  ],
  declarations: [
    SettingsComponent,
    AccountManagementComponent,
    LoginLogComponent
  ]//,
  //entryComponents: [ EditUserModalComponent ]
})

export class SettingsModule { }
