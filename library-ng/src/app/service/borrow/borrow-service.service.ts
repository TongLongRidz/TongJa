import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { BorrowBook, BorrowBook2, BorrowBookTable } from '../interface/borrow';
import { HttpClient, HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Environment } from '../../common/environment';

@Injectable({
  providedIn: 'root',
})
export class BorrowService {
  private apiUrl = Environment.apiBaseUrl + 'api/borrowing';
  constructor(private http: HttpClient) {}

  getBorrowBookList(
    page: number,
    size: number,
    sort: boolean,
    name_sort: string,
    his: boolean,
    lang: string
  ): Observable<BorrowBookTable> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort.toString())
      .set('name_sort', name_sort)
      .set('his', his.toString())
      .set('lang', lang.toString());
    return this.http.get<BorrowBookTable>(this.apiUrl, { params });
  }

  getBorrowBookByID(id: number): Observable<BorrowBook> {
    return this.http.get<BorrowBook>(`${this.apiUrl}/${id}`);
  }

  editBorrowBook(bookForm: BorrowBook2): Observable<any> {
    const body = {
      id: bookForm.id,
      borrowEnd: formatDate(bookForm.borrowEnd, 'yyyy-MM-dd', 'en'),
      borrowStatus: bookForm.borrowStatus,
      active: bookForm.active,
      borrowImage: bookForm.borrowImage,
    };
    return this.http.post<any>(`${this.apiUrl}/edit`, body, {
      responseType: 'text' as 'json',
    });
  }

  deleteStatusBorrowBook(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/delete/${id}`, {
      responseType: 'text' as 'json',
    });
  }

  postSearchBorrowBook(
    searchKey: string,
    page: number,
    size: number,
    sort: boolean,
    his: boolean,
    lang: string
  ): Observable<BorrowBookTable> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort.toString())
      .set('his', his.toString())
      .set('lang', lang.toString());
    return this.http.post<BorrowBookTable>(`${this.apiUrl}/search`, searchKey, {
      params,
    });
  }

  // saveBorrowData(borrowData: any): Observable<any> {
  //   console.log("borrowData sv:",borrowData);

  //   return this.http.post<any>(`${this.apiUrl}/saveBorrowData`, borrowData);
  // }

  //History List
  searchGetHistoryData(
    keyword: string,
    page: number,
    size: number,
    sort: boolean
  ): Observable<any> {
    const currentPage = page - 1;
    if (!keyword === undefined || keyword === null) {
      keyword = '';
    }

    const params = new HttpParams()
      .set('page', currentPage.toString())
      .set('size', size.toString())
      .set('sort', sort.toString());

    const body = { keyword };
    const url = `${this.apiUrl}/searchHis`;

    return this.http.post<any>(url, body, { params });
  }

  //

  searchGetMyHistoryData(
    keyword: string,
    profileCode: string,
    page: number,
    size: number,
    sort: boolean,
    status: number | null
  ): Observable<any> {
    const currentPage = page - 1;

    if (!keyword) {
      keyword = '';
    }

    if (!profileCode) {
      throw new Error('Profile code is required');
    }

    let params = new HttpParams()
      .set('page', currentPage.toString())
      .set('size', size.toString())
      .set('sort', sort.toString());

    if (status !== null) {
      params = params.set('status', status.toString());
    }

    const body = { keyword, profileCode };
    const url = `${this.apiUrl}/searchMyHis`;

    return this.http.post<any>(url, body, { params });
  }

  searchGetMyListborrowData(
    keyword: string,
    profileCode: string,
    page: number,
    size: number,
    sort: boolean,
    status: number | null
  ): Observable<any> {
    const currentPage = page - 1;

    if (!keyword) {
      keyword = '';
    }

    if (!profileCode) {
      throw new Error('Profile code is required');
    }

    let params = new HttpParams()
      .set('page', currentPage.toString())
      .set('size', size.toString())
      .set('sort', sort.toString());

    if (status !== null) {
      params = params.set('status', status.toString());
    }

    const body = { keyword, profileCode };
    const url = `${this.apiUrl}/searchMyListBorrow`;

    return this.http.post<any>(url, body, { params });
  }

  saveBorrowData(borrowingBookDTO: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/saveBorrowData`, borrowingBookDTO)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(`Error saving data: ${error.message}`)
          );
        })
      );
  }

  getborrowImage(id: String) {
    return this.http.get(`${this.apiUrl}/getborrowImage/${id}`);
  }
}
