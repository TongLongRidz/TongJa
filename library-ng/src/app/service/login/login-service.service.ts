import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../common/environment';



@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  constructor(private http: HttpClient) {
    console.log(Environment.apiBaseUrl);

  }


  private apiUrl = Environment.apiBaseUrl + 'auth';
  onLogin(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, body);
  }

  getDocManual(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/doc/manual`, {
      responseType: 'blob' as 'json',
    });
  }
}
