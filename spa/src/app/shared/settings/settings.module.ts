import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';

import { SettingsComponent } from './settings.component';
import { AccountManagementComponent } from './account-management/account-management.component';

@NgModule({
  imports: [
    CommonModule,
    MomentModule
  ],
  exports: [
    SettingsComponent,
    AccountManagementComponent
  ],
  declarations: [
    SettingsComponent,
    AccountManagementComponent
  ]
})

export class SettingsModule { }
