import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../common/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterServiceService {
  http = inject(HttpClient);

  private apiUrl = Environment.apiBaseUrl + 'auth';


  constructor() { }


  registerUser(data : any): Observable<any> {
    const body = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      telephone: data.telephone,
      image: data.image,
    }
    return this.http.post<any>(`${this.apiUrl}/register`, body);
  }

  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    const params = new HttpParams().set('email', email);
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/checkEmailExists`, { params });

  }


}
