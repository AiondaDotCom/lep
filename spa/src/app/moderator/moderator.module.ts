import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeratorRoutingModule } from './moderator-routing.module';

import { DashboardModule } from '../shared/dashboard/dashboard.module';

import { ModeratorComponent } from './moderator.component';
import { ModeratorDashboardComponent } from './moderator-dashboard/moderator-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    ModeratorRoutingModule,
    DashboardModule
  ],
  declarations: [
    ModeratorComponent,
    ModeratorDashboardComponent
  ]
})
export class ModeratorModule { }
