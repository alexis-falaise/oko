import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

import { ServerResponse } from '@models/app/server-response.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  appUrl = `${environment.serverUrl}/app`;

  constructor(private http: HttpClient) { }

  uploadPicture(picture: File): Observable<ServerResponse> {
    const formData = new FormData();
    formData.append('picture', picture);
    return this.http.post(`${this.appUrl}/picture/upload`, formData) as Observable<ServerResponse>;
  }
}
