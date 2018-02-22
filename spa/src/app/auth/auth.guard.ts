import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()

export class AuthGuardUser implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.authenticated && this.authService.accountType == 'user') {
      return true;
    }
    else {
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }
  }
}

@Injectable()

export class AuthGuardAdmin implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.authenticated && this.authService.accountType == 'admin') {
      return true;
    }
    else {
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }
  }
}
