import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../common/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = Environment.apiBaseUrl + 'notifications';

  http = inject(HttpClient);

  constructor() { }

  getNotifications(profileCode: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all/${profileCode}`);
  }

  isRead(id: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/isRead/${id}`, {});
  }

  IsReadAll(profileCode: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/isReadAll/${profileCode}`, {});
  }

  deleteAll(profileCode: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/isDeleteAll/${profileCode}`, {});
  }


  deleteSelected(selectedIds: number[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/deleteSelected`, selectedIds);
}



}
