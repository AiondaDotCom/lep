import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes, CanActivate } from '@angular/router';

import { AuthGuardAdmin } from '../auth/auth.guard';

import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [
      AuthGuardAdmin
    ],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'settings',
        component: AdminSettingsComponent
      }
    ]
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: [],
  providers: [AuthGuardAdmin]
})


export class AdminRoutingModule { }
