import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { Router } from '@angular/router';
import { MomentModule } from 'angular2-moment';

//import { SettingsModule } from './settings/settings.module';
//import { AdminModule } from './admin/admin.module';
//import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { WhitelistdDomainValidatorDirective } from './auth/whitelisted-domains.directive';
import { MessageService } from './message.service';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { LoadingIndicatorService } from './loading-indicator/loading-indicator.service';
import { ApiService } from './api/api.service';

// Toplevel components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HelpComponent } from './help/help.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// Shared Components
import { DashboardComponent } from './shared/dashboard/dashboard.component';

// User Component
import { UserComponent } from './user/user.component';
import { SettingsComponent } from './user/settings/settings.component';
import { AccountManagementComponent } from './user/settings/account-management/account-management.component';
import { MiscellaneousComponent } from './user/settings/miscellaneous/miscellaneous.component';

// Admin Components
import { AdminComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminAccountManagerComponent } from './admin/admin-account-manager/admin-account-manager.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { LegalNoticeComponent } from './shared/legal-notice/legal-notice.component';
import { ModeratorComponent } from './moderator/moderator.component';
import { ModeratorDashboardComponent } from './moderator/moderator-dashboard/moderator-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    WhitelistdDomainValidatorDirective,
    // General
    LoginComponent,
    DashboardComponent,
    PageNotFoundComponent,
    RegisterComponent,
    HelpComponent,
    LoadingIndicatorComponent,
    // User
    UserComponent,
    SettingsComponent,
    AccountManagementComponent,
    MiscellaneousComponent,
    // Admin
    AdminComponent,
    AdminDashboardComponent,
    AdminAccountManagerComponent,
    UserDashboardComponent,
    LegalNoticeComponent,
    ModeratorComponent,
    ModeratorDashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    //  SettingsModule,
    //AdminModule,
    //  UserModule,
    AppRoutingModule,
    MomentModule
  ],
  providers: [AuthService, MessageService, LoadingIndicatorService, ApiService],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(router: Router) {
    // Debug information of router configuration
    console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}
