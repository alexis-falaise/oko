import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

import { ServerResponse } from '@models/app/server-response.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  appUrl = `${environment.serverUrl}/app`;

  constructor(private http: HttpClient) { }

  uploadPicture(picture: File): Observable<any> {
    const formData = new FormData();
    formData.append('picture', picture);
    return this.http.post(`${this.appUrl}/picture/upload`, formData, {
      reportProgress: true,
      observe: 'events',
    }).pipe(map((event) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          return { status: 'progress', data: progress };
        case HttpEventType.Response:
          return { status: 'done', data: event.body };
        default:
          return { status: 'weird', message: `Unhandled event: ${event.type}` };
      }
    }));
  }
}
