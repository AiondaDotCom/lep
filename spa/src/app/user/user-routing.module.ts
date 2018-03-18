import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes, CanActivate } from '@angular/router';

import { AuthGuardUser } from '../auth/auth.guard';

import { UserComponent } from '../user/user.component';
import { UserDashboardComponent } from '../user/user-dashboard/user-dashboard.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';

//import { AccountManagementComponent } from '../shared/account-management/account-management.component';
//import { SettingsComponent } from '..//settings/settings.component';
//import { MiscellaneousComponent } from '../user/settings/miscellaneous/miscellaneous.component';

const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    canActivate: [
      AuthGuardUser
    ],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: UserDashboardComponent
      },
      {
        path: 'settings',
        component: UserSettingsComponent/*,
        children: [
          {
            path: '',
            redirectTo: 'account',
            pathMatch: 'full'
          },
          {
            path: 'account',
            component: AccountManagementComponent
          },
          {
            path: 'misc',
            component: MiscellaneousComponent
          }
        ]*/
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
  providers: [AuthGuardUser]
})

export class UserRoutingModule { }
