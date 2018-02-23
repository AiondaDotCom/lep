import { NgModule } from '@angular/core';

import { RouterModule, Routes, CanActivate } from '@angular/router';

import { AuthGuardUser, AuthGuardModerator, AuthGuardAdmin } from './auth/auth.guard';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HelpComponent } from './help/help.component';
import { LegalNoticeComponent } from './shared/legal-notice/legal-notice.component';

import { UserComponent } from './user/user.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { SettingsComponent } from './user/settings/settings.component';
import { AccountManagementComponent } from './user/settings/account-management/account-management.component';
import { MiscellaneousComponent } from './user/settings/miscellaneous/miscellaneous.component';

import { AdminComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';

import { ModeratorComponent } from './moderator/moderator.component';
import { ModeratorDashboardComponent } from './moderator/moderator-dashboard/moderator-dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
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
  },
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
      }
    ]
  },
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
        component: SettingsComponent,
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
        ]
      }
    ]
  },
  {
    path: 'help',
    component: HelpComponent
  },
  {
    path: 'legal-notice',
    component: LegalNoticeComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: [],
  providers: [AuthGuardAdmin, AuthGuardModerator, AuthGuardUser]
})
export class AppRoutingModule { }
