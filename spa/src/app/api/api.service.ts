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

  getServerStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/status`)
  }

  restricted(): Observable<any> {
    // Demo metod to test jwt token on restricted content
    return this.http.get(`${this.apiUrl}/restricted`, {
      params: {
        'jwt': localStorage.getItem('jwt')
      }
    })
  }

  downloadDocument(): void {
    let url = `${this.apiUrl}/doc/download?token=${localStorage.getItem('jwt')}`;
    window.location.href = url;
  }

  postFile(fileToUpload: File): Observable<any> {
    const endpoint = `${this.apiUrl}/doc/upload`;

    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    return this.http.post(endpoint, formData, {
      params: {
        'token': localStorage.getItem('jwt')
      }
    })
    //  .map(() => { return true; })
    //  .catch((e) => this.handleError(e));
  }

  getLoginLog(): Observable<any> {
    // Demo metod to test jwt token on restricted content
    return this.http.get(`${this.apiUrl}/user/getLoginLog`, {
      params: {
        'token': localStorage.getItem('jwt')
      }
    })
  }

  deleteAccount(username: string, password: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/delete`, {
      params: {
        'name': username,
        'password': password
      }
    })
  }

  getDomainWhitelist(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getDomainWhitelist`)
  }

  getAccountList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/getAccountList`, {
      params: {
        'token': localStorage.getItem('jwt')
      }
    })
  }

  renewToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/renewToken`, {
      params: {
        'token': localStorage.getItem('jwt')
      }
    })
  }

  whatIsMyIP(): Observable<any> {
    return this.http.get(`${this.apiUrl}/whatIsMyIP`)
  }

  testDatabaseConnection(setupToken: string, url: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/setup/testDatabaseConnection`, {
      params: {
        'setupToken': setupToken,
        'url': url
      }
    })
  }

}
