import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LoadingIndicatorModule } from '../loading-indicator/loading-indicator.module';

import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminAccountManagerComponent } from './admin-account-manager/admin-account-manager.component';
import { DashboardModule } from '../shared/dashboard/dashboard.module';
import { EditUserModalModule } from '../shared/edit-user-modal/edit-user-modal.module';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    DashboardModule,
    LoadingIndicatorModule,
    EditUserModalModule
  ],
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AdminAccountManagerComponent
  ]
})

export class AdminModule { }
