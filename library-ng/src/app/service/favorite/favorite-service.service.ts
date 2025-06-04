import { inject, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from 'ngx-pagination';
import { catchError, Observable, throwError } from 'rxjs';
import { BookEntity, FavoriteResponse } from '../interface/favorite';
import { Environment } from '../../common/environment';


@Injectable({
  providedIn: 'root'
})
export class FavoriteServiceService implements OnInit {

  private apiUrl = Environment.apiBaseUrl + 'api/favorite';
  http = inject(HttpClient)


  constructor() { }
  ngOnInit(): void {

  }

  checkListFavorites(profileCode: string){
    return this.http.get<any>(`${this.apiUrl}/checkListFavorite/${profileCode}`);
  }

  getDataFavorites(profileCode: string, page: number , size: number ): Observable<any> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
    return this.http.get<FavoriteResponse>(`${this.apiUrl}/getFavoriteProfile/${profileCode}`, { params });
  }

  searchGetCategory(keyword: string,profileCode: string , category: string, page: number, size: number): Observable<any> {
    const currentPage = page - 1;
    if (!keyword) {
      keyword = "";
    }
    const params = new HttpParams()
      .set('page', currentPage.toString())
      .set('size', size.toString())
      .set('profileCode', profileCode.toString())
  
    const url = `${this.apiUrl}/search`;
    const body = { keyword,category};
  
    return this.http.post<any>(url, body, { params });
  }

  listCategorybyfavorite(profileCode: string): Observable<any>{
    const params = new HttpParams()
    .set('profileCode', profileCode.toString());
    const url = `${this.apiUrl}/getLikedCategories`;
    return this.http.get<any>(url, { params });
  }

  deleteFavorite(bookCode: string, profileCode: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${bookCode}/${profileCode}`);
  }

  addFavorite(bookCode: string, profileCode: string): Observable<any> {
    const body = {
      bookCode: bookCode,
      profileCode: profileCode
    };
    return this.http.post(`${this.apiUrl}/addFavorite`, body);
  }
  
  
  
}
