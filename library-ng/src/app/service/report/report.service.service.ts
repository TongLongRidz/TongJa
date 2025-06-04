import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TopViewedBook } from '../interface/book';
import { Environment } from '../../common/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {
  http = inject(HttpClient);

  private apiUrl = Environment.apiBaseUrl + 'api/report';


  constructor() { }

  getReportAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reportAll`);
  }


  sendDate(startDate: any|null, endDate: any|null): Observable<any> {

    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get(`${this.apiUrl}/send-date`, { params });
  }

  getMostReqBorrow(period: String, page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/mostBorrowers?period=${period}&page=${page}&size=${size}`);
  }


  getReportBorrowMoth(date: any,category: string): Observable<any> {
    const params = new HttpParams()
      .set('date', date)
      .set('category',category)
    return this.http.get<any>(`${this.apiUrl}/reportBorrowMoth`, { params });
  }
  

  getTopBooks(date: any): Observable<any> {
    const params = new HttpParams()
      .set('date', date);
    return this.http.get<any>(`${this.apiUrl}/getTopBooked`, { params });
  }


  getTopViewedBooks(limit: number = 10,categoryCode?: string): Observable<TopViewedBook> {

    let params = new HttpParams().set('limit', limit.toString());
    if (categoryCode) {
      params = params.set('categoryCode', categoryCode);
    }
    return this.http.get<TopViewedBook>(`${this.apiUrl}/top-viewed`,{ params });
  }


  getBorrowingByPeriod(dtoReq: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/borrowing-period1`, dtoReq);
  }

}


