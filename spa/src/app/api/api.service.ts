import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class ApiService {

  private apiUrl = `${window.location.protocol}//${window.location.hostname}/api`;

  constructor(private http: HttpClient) { }

  restricted(): Observable<any> {
    // Demo metod to test jwt token on restricted content
    return this.http.get(`${this.apiUrl}/restricted`, {
      params: {
        'jwt': localStorage.getItem('jwt')
      }
    })
  }

}
