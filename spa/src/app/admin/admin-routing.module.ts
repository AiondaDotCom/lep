import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes, CanActivate } from '@angular/router';

import { AuthGuardAdmin } from '../auth/auth.guard';

import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { HelpComponent } from '../help/help.component';
import { LegalNoticeComponent } from '../shared/legal-notice/legal-notice.component';

import { UserComponent } from '../user/user.component';
import { UserDashboardComponent } from '../user/user-dashboard/user-dashboard.component';
import { SettingsComponent } from '../user/settings/settings.component';
import { AccountManagementComponent } from '../shared/account-management/account-management.component';
import { MiscellaneousComponent } from '../user/settings/miscellaneous/miscellaneous.component';

import { AdminComponent } from '../admin/admin.component';
import { AdminDashboardComponent } from '../admin/admin-dashboard/admin-dashboard.component';

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
        component: AccountManagementComponent
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
