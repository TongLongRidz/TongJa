import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { log } from 'node:console';
import { Environment } from '../../common/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryServiceService {
  private apiUrl = Environment.apiBaseUrl+ 'api/category';

  constructor(private http: HttpClient) {}

  getAllCategory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAllCategory`);
  }

  addCategory(category: any): Observable<any> { 
    return this.http.post<any>(`${this.apiUrl}/postCategory`, category,{ responseType: 'text' as 'json' });
  }

  updateCategory(id:number,category: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/putcategory/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(`${this.apiUrl}/deleteCategory/${id}`);
  }

  searchGetCategory(keyword: string, page: number, size: number, sort: boolean): Observable<any> {
    const currentPage = page - 1;
    if (!keyword) {
      keyword = "";
    }
  
    const params = new HttpParams()
      .set('page', currentPage.toString())
      .set('size', size.toString())
      .set('sort', sort.toString());
  
    const url = `${this.apiUrl}/search`;
    const body = { keyword };
  
    return this.http.post<any>(url, body, { params });
  }
  


  
  getAllCategoryCodesInUse(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/checkAllCategoryCodes`);
  }



}
