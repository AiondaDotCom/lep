import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes, CanActivate } from '@angular/router';

import { AuthGuardModerator } from '../auth/auth.guard';

import { ModeratorComponent } from './moderator.component';
import { ModeratorDashboardComponent } from './moderator-dashboard/moderator-dashboard.component';
import { ModeratorSettingsComponent } from './moderator-settings/moderator-settings.component';

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
        component: ModeratorSettingsComponent
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
