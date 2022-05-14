import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IActionResponse } from '../models/Authenticate.Model/IActionResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  constructor(private http: HttpClient) {}

  quickServiceTokenAuthorization(request: string): Observable<IActionResponse> {
    // let token = localStorage.getItem('authorization');
    // const tokens = 'Bearer' + ' ' + token;
    // const staff = '"' + request + '"';
    // const headers = {
    //   'Content-Type': 'application/json',
    //   Authorization: tokens,
    // };
    // console.log('header', headers);
    return this.http.post<IActionResponse>(
      environment.baseURI + 'Authentication/AuthenticateUser',
      { userId: request }
      // { headers: headers }
    );
  }
}
