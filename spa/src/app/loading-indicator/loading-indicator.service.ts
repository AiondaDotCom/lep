import { Injectable } from '@angular/core';

@Injectable()
export class LoadingIndicatorService {

  spinners = {}

  constructor() { }

  register(newSpinner) {
    if (!(newSpinner in this.spinners)) {
      this.spinners[newSpinner] = false;
      console.log('registered spinners: ', this.spinners);
    }
  }

  start(spinnerName: string): void {
    console.log(`starting spinner ${spinnerName}`)
    this.spinners[spinnerName] = true;
    console.log(this.spinners)
  }

  stop(spinnerName: string): void {
    console.log(`stopping spinner ${spinnerName}`)
    this.spinners[spinnerName] = false;
  }

  isActive(spinnerName: string): boolean {
    return this.spinners[spinnerName];
  }

}
