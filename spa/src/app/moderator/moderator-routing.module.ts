import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes, CanActivate } from '@angular/router';

import { AuthGuardModerator } from '../auth/auth.guard';

import { AccountManagementComponent } from '../shared/account-management/account-management.component';

import { ModeratorComponent } from '../moderator/moderator.component';
import { ModeratorDashboardComponent } from '../moderator/moderator-dashboard/moderator-dashboard.component';


const routes: Routes = [
  {
    path: 'moderator',
    component: ModeratorComponent,
    canActivate: [
      AuthGuardModerator
    ],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: ModeratorDashboardComponent
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
  providers: [AuthGuardModerator]
})

export class ModeratorRoutingModule { }
