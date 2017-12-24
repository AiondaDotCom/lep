import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { User } from './user'

@Injectable()
export class AuthService {

  constructor() { }

  login(user: User): Observable<any> {
    console.log(user.password)
    // TODO: Call to REST API and Error-handling
    if (user.password == '42') {
      return of("login successful");
    }
    else {
      return of("error");
    }
  }
}
