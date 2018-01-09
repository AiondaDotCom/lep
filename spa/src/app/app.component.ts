import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css'
  ]
})
export class AppComponent {
  title = 'Aionda LEP';
  navbarCollapsed = true; // Initially the navbar is collapsed (Mobile only)

  constructor(public authService: AuthService, private router: Router) { }

  logout(): void {
    this.authService.logout();
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}
