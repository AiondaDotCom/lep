import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth/auth.service';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';

@Injectable()

export class AuthGuardSetup implements CanActivate {

  constructor(private authService: AuthService, private api: ApiService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // Check if the setup process is active
    // TODO: API call to retrieve correct status
    let canActivateSetup = true;
    if (canActivateSetup) {
      return true;
    }
    else {
      // Prevent user from accessing /setup
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }
  }
}
