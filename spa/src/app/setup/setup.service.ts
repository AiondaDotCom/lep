import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

@Injectable()
export class SetupService {

  allowedStep = 1;
  currentStep = 1;
  stepRouteMapping = [
    '/setup/auth',
    '/setup/admin',
    '/setup/database',
    '/setup/finish'
  ]

  constructor(
    private router: Router
  ) { }

  unlockStep(step: number) {
    this.allowedStep = step;
  }

  navigateStep(step: number) {
    this.currentStep = step;
    this.router.navigate([this.stepRouteMapping[step-1]]);
  }

}
