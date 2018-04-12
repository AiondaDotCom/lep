import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LoadingIndicatorModule } from '../loading-indicator/loading-indicator.module';
import { SettingsModule } from '../shared/settings/settings.module';
import { DashboardModule } from '../shared/dashboard/dashboard.module';

import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminAccountManagerComponent } from './admin-account-manager/admin-account-manager.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';

//import { DashboardModule } from '../shared/dashboard/dashboard.module';
import { EditUserModalModule } from '../shared/edit-user-modal/edit-user-modal.module';
import { DomainWhitelistManagerComponent } from './domain-whitelist-manager/domain-whitelist-manager.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    DashboardModule,
    SettingsModule,
    LoadingIndicatorModule,
    EditUserModalModule
  ],
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AdminAccountManagerComponent,
    AdminSettingsComponent,
    DomainWhitelistManagerComponent
  ]
})

export class AdminModule { }
