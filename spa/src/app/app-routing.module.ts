import { NgModule } from '@angular/core';

import { RouterModule, Routes, CanActivate } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'settings', component: SettingsComponent, canActivate: [
      AuthGuard
    ]
  },
  { path: '**', component: PageNotFoundComponent }
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
