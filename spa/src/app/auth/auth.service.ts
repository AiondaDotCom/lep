import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiService } from '../api/api.service';

import { User } from '../user';

@Injectable()
export class AuthService {

  private apiUrl = `${window.location.protocol}//${window.location.hostname}/api`;//'http://localhost/api';

  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  userProfile: User;

  whitelist = [];

  constructor(private http: HttpClient, private api: ApiService) {
    // If authenticated, set local profile property and update login status subject
    // If token is expired, log out to clear any data from localStorage
    if (this.authenticated) {
      this.userProfile = JSON.parse(localStorage.getItem('profile'));
      this.setLoggedIn(true);
    } else {
      this.logout();
    }

    api.getDomainWhitelist()
      .subscribe(data => {
        console.log('Domainwhitelist successfully fetched');
        this.whitelist = data;
        localStorage.setItem('domainWhitelist', JSON.stringify(this.whitelist));
      },
      err => {
        console.log('Error fetching domainWhitelist')
        this.whitelist = ['Error: could not load domainwhitelist']
      })
  }

  get domainWhitelist() {
    return this.whitelist;
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


  requestRegistration(mail: string): Observable<any> {
    //this.userProfile = user;
    return this.http.get(`${this.apiUrl}/user/requestRegistration`, {
      params: {
        'email': mail
      }
    })
  }


  register(user: User, registrationToken: string): Observable<any> {
    //this.userProfile = user;
    return this.http.get(`${this.apiUrl}/user/register`, {
      params: {
        'token': registrationToken,
        'email': user.email,
        'fullName': user.fullName,
        'password': user.password
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
    localStorage.setItem('accountType', authResult.accountType);
    this.userProfile = profile;
    this.setLoggedIn(true);
  }

  logout() {
    // Remove tokens and profile and update login status subject
    localStorage.removeItem('jwt');
    localStorage.removeItem('expireTimestamp');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('accountType');
    this.userProfile = undefined;
    this.setLoggedIn(false);
  }

  get authenticated(): boolean {
    // Check if current date is greater than expiration
    const expiresAt = JSON.parse(localStorage.getItem('expireTimestamp'));
    return Date.now() < expiresAt;
  }

  get accountType(): string {
    let accountType = localStorage.getItem('accountType')
    return accountType ? accountType : 'user';
  }

}
