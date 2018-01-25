import { Injectable } from '@angular/core';

@Injectable()
export class LoadingIndicatorService {

  spinners = {}

  constructor() { }

  register(newSpinner) {
    this.spinners[newSpinner] = false;
    console.log('registered spinners: ', this.spinners);
  }

  start(spinnerName: string): void {
    this.spinners[spinnerName] = true;
  }

  stop(spinnerName: string): void {
    this.spinners[spinnerName] = false;
  }

  isActive(spinnerName: string): boolean {
    return this.spinners[spinnerName];
  }

}
