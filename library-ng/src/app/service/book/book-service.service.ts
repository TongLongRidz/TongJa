import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BookBorrowCounts, BookDetail, BookManage, BookTable } from '../interface/book';
import { AddCommentInterface, getCommentsInterface } from '../interface/book';
import { Environment } from '../../common/environment';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = Environment.apiBaseUrl + 'api/book';

  constructor(private http: HttpClient) { }
  getBookList(
    page: number,
    size: number,
    sort: boolean,
    name_sort: string,
    his: boolean,
    lang: string
  ): Observable<BookTable> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort.toString())
      .set('name_sort', name_sort.toString())
      .set('his', his.toString())
      .set('lang', lang.toString());
    return this.http.get<BookTable>(this.apiUrl, { params });
  }

  getBookByID(id: number): Observable<BookManage> {
    return this.http.get<BookManage>(`${this.apiUrl}/${id}`);
  }

  newBook(bookForm: BookManage): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/new`, bookForm, {
      responseType: 'text' as 'json',
    });
  }

  editBook(bookForm: BookManage, active: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/edit?active=${active}`,
      bookForm,
      {
        responseType: 'text' as 'json',
      }
    );
  }

  deleteKillBook(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/kill/${id}`, {
      responseType: 'text' as 'json',
    });
  }

  deleteStatusBook(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/delete/${id}`, {
      responseType: 'text' as 'json',
    });
  }

  reDeleteStatusBook(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/redelete/${id}`, {
      responseType: 'text' as 'json',
    });
  }

  postSearch(
    searchKey: string,
    page: number,
    size: number,
    sort: boolean,
    name_sort: string,
    his: boolean,
    lang: string
  ): Observable<BookTable> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort.toString())
      .set('name_sort', name_sort.toString())
      .set('his', his.toString())
      .set('lang', lang.toString());
    return this.http.post<BookTable>(`${this.apiUrl}/search`, searchKey, {
      params,
    });
  }

  searchGetBookList(
    page: number,
    size: number,
    categoryCode: string | null,
    status: string | null
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (categoryCode) {
      params = params.set('categoryCode', categoryCode);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<any>(`${this.apiUrl}/searchbooks`, { params });
  }

  // private setIdBookDetail = new BehaviorSubject<number>(0);
  // getIdBookDetail = this.setIdBookDetail.asObservable();
  // setIdBookDetailFunc(id: number) {
  //   this.setIdBookDetail.next(id);
  // }

  checkBookDetailByID(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/detail/check/${id}`);
  }

  getBookDetailByID(id: number): Observable<BookDetail> {
    return this.http.get<BookDetail>(`${this.apiUrl}/detail/${id}`);
  }

  getBookRecommend(id: number): Observable<BookDetail[]> {
    return this.http.get<BookDetail[]>(`${this.apiUrl}/detail/recommend/${id}`);
  }

  getBookBorrowCounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/borrow-counts`);
  }

  addComment(comments: AddCommentInterface): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/comment/add`, comments, {
      responseType: 'text' as 'json',
    });
  }

  getComments(
    bookCode: String,
    page: number,
    size: number
  ): Observable<getCommentsInterface> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<getCommentsInterface>(
      `${this.apiUrl}/comment/book/${bookCode}`,
      {
        params,
      }
    );
  }



  incrementTotalView(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/increment-view/${id}`, {});
  }



}
