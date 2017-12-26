import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './user'

@Injectable()
export class AuthService {

  private apiUrl = `${window.location.protocol}//${window.location.hostname}/api`;//'http://localhost/api';

  constructor(private http: HttpClient) { }

  login(user: User): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/login`, {
      params: {
        'name': user.email,
        'password': user.password
      }
    })
  }
}
