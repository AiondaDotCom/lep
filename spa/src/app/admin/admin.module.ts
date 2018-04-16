import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { LoadingIndicatorModule } from '../loading-indicator/loading-indicator.module';
import { SettingsModule } from '../shared/settings/settings.module';
import { DashboardModule } from '../shared/dashboard/dashboard.module';

import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminAccountManagerComponent } from './admin-account-manager/admin-account-manager.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';

import { EditUserModule } from '../shared/edit-user/edit-user.module';
import { DomainWhitelistManagerComponent } from './domain-whitelist-manager/domain-whitelist-manager.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    DashboardModule,
    SettingsModule,
    LoadingIndicatorModule,
    EditUserModule,
    NgbModule,
    ReactiveFormsModule
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
