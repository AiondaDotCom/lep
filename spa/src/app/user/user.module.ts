import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';

import { DashboardModule } from '../shared/dashboard/dashboard.module';

import { UserComponent } from './user.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    DashboardModule
  ],
  declarations: [
    UserComponent,
    UserDashboardComponent
  ]
})
export class UserModule { }
