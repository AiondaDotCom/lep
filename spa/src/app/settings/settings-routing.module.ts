import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';


import { SettingsComponent } from './settings.component';
import { AccountManagementComponent } from './account-management/account-management.component';
import { MiscellaneousComponent } from './miscellaneous/miscellaneous.component';

const settingsRoutes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [
      AuthGuard
    ],
    children: [
      {
        path: 'account',
        component: AccountManagementComponent
      },
      {
        path: 'misc',
        component: MiscellaneousComponent
      },
      {
        path: '', redirectTo: '/settings/account',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(settingsRoutes)
  ],
  exports: [
    RouterModule
  ]
})



export class SettingsRoutingModule { }
