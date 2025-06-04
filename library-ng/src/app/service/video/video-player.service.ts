import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Environment } from '../../common/environment';

@Injectable({
  providedIn: 'root',
})
export class VideoPlayerService {
  private apiUrl = Environment.apiBaseUrl + 'api/video';

  private HOME_VDO = new BehaviorSubject<boolean>(true);
  public homeVDO$ = this.HOME_VDO.asObservable();

  constructor(private http: HttpClient) {}

  getVideoHome(videoSrc: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${videoSrc}`, {
      responseType: 'blob',
    });
  }

  changVideoHome(sts: boolean) {
    this.HOME_VDO.next(sts);
  }
}
