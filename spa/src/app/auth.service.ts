import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './user'

@Injectable()
export class AuthService {

  private apiUrl = `${window.location.protocol}//${window.location.hostname}/api`;//'http://localhost/api';

  isLoggedIn = false;
  user: User;
  jwt = '';

  constructor(private http: HttpClient) { }

  login(user: User): Observable<any> {
  //  this.isLoggedIn = true;
    this.user = user;
    return this.http.get(`${this.apiUrl}/user/login`, {
      params: {
        'name': user.email,
        'password': user.password
      }
    }).pipe(
      tap(response => this.jwt = response.jwt) // Store jwt
    )
  }

  restricted(): Observable<any> {
    return this.http.get(`${this.apiUrl}/restricted`, {
      params: {
        'jwt': this.jwt
      }
    })
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }

}
