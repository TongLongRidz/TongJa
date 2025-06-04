import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ProfileByIdCheckEmailInterface,
  ProfileByIdResetPasswordInterface,
  ProfileEditInterface,
  ProfileTableInterface,
} from '../interface/profile';
import { AuthService } from '../auth/auth.service';
import { Environment } from '../../common/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = Environment.apiBaseUrl + 'api/profile';

  profileData: any;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getProfileById(profileId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${profileId}`);
  }

  getProfileByIdEntity(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  editProfileEntity(user: ProfileEditInterface): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/edit`, user);
  }

  adminAddUserProfile(user: ProfileEditInterface): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/addUser`, user);
  }
  adminEditProfile(user: ProfileEditInterface): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/edit`, user);
  }

  adminEditProfilePassword(
    user: ProfileByIdResetPasswordInterface
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/edit/password`, user);
  }

  adminCheckEmail(user: ProfileByIdCheckEmailInterface): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/check/email`, user);
  }

  getProfileList(
    page: number,
    size: number,
    sort: boolean,
    name_sort: string,
    his: boolean
  ): Observable<ProfileTableInterface> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort.toString())
      .set('name_sort', name_sort.toString())
      .set('his', his.toString());
    return this.http.get<ProfileTableInterface>(this.apiUrl, { params });
  }

  postProfileSearch(
    searchKey: string,
    page: number,
    size: number,
    sort: boolean,
    name_sort: string,
    his: boolean
  ): Observable<ProfileTableInterface> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort.toString())
      .set('name_sort', name_sort.toString())
      .set('his', his.toString());
    return this.http.post<ProfileTableInterface>(
      `${this.apiUrl}/search`,
      searchKey,
      {
        params,
      }
    );
  }

  deleteProfileByID(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/delete/${id}`);
  }
} // end
