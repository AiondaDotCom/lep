import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './user'

@Injectable()
export class AuthService {

  private apiUrl = `${window.location.protocol}//${window.location.hostname}/api`;//'http://localhost/api';

  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  userProfile: User;

  constructor(private http: HttpClient) {
    // If authenticated, set local profile property and update login status subject
    // If token is expired, log out to clear any data from localStorage
    if (this.authenticated) {
      this.userProfile = JSON.parse(localStorage.getItem('profile'))
      this.setLoggedIn(true);
    } else {
      this.logout();
    }
  }

  login(user: User): Observable<any> {
    this.userProfile = user;
    return this.http.get(`${this.apiUrl}/user/login`, {
      params: {
        'name': user.email,
        'password': user.password
      }
    }).pipe(
      tap(
        response => this._setSession(response)
      )
    )
  }

  restricted(): Observable<any> {
    // Demo metod to test jwt token on restricted content
    // TODO: Move this into own apiService
    return this.http.get(`${this.apiUrl}/restricted`, {
      params: {
        'jwt': localStorage.getItem('jwt')
      }
    })
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  private _setSession(authResult) {
    const expTime = authResult.expireTimestamp * 1000;
    // Save session data and update login status subject
    const profile = authResult;
    localStorage.setItem('jwt', authResult.jwt);
    localStorage.setItem('profile', JSON.stringify(profile));
    localStorage.setItem('expireTimestamp', JSON.stringify(expTime));
    this.userProfile = profile;
    this.setLoggedIn(true);
  }

  logout() {
    // Remove tokens and profile and update login status subject
    localStorage.removeItem('jwt');
    localStorage.removeItem('expireTimestamp');
    localStorage.removeItem('userProfile');
    this.userProfile = undefined;
    this.setLoggedIn(false);
  }

  get authenticated(): boolean {
    // Check if current date is greater than expiration
    const expiresAt = JSON.parse(localStorage.getItem('expireTimestamp'));
    return Date.now() < expiresAt;
  }

}
