import { NgModule } from '@angular/core';

import { RouterModule, Routes, CanActivate } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HelpComponent } from './help/help.component';

import { UserComponent } from './user/user.component';

import { DashboardComponent } from './user/dashboard/dashboard.component';
import { SettingsComponent } from './user/settings/settings.component';
import { AccountManagementComponent } from './user/settings/account-management/account-management.component';
import { MiscellaneousComponent } from './user/settings/miscellaneous/miscellaneous.component';

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
    path: 'user',
    component: UserComponent,
    canActivate: [
      AuthGuard
    ],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
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
  providers: [AuthGuard]
})
export class AppRoutingModule { }
