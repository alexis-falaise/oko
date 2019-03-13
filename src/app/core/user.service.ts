import { Injectable } from '@angular/core';
import { HttpClient, HttpProgressEvent, HttpEventType } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '@models/user.model';
import { environment } from '@env/environment';
import { ServerResponse } from '@models/app/server-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private serverUrl = environment.serverUrl;
  private userUrl = `${this.serverUrl}/user`;
  private currentUser = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
  ) { }

  getCurrentUser(): Observable<User> {
    return this.http.get(`${this.userUrl}/current`, {withCredentials: true}) as Observable<User>;
  }

  getUserById(id: string): Observable<User> {
    return this.http.get(`${this.userUrl}/${id}`, {withCredentials: true}) as Observable<User>;
  }

  getUserStatsById(id: string): Observable<User> {
    return this.http.get(`${this.userUrl}/${id}/stats`, {withCredentials: true}) as Observable<User>;
  }

  updateUser(user: User): Observable<Object> {
    return this.http.put(`${this.userUrl}/${user.id}`, user, {withCredentials: true});
  }

  uploadUserAvatar(picture: File, user: User): Observable<ServerResponse> {
    const formData = new FormData();
    formData.append('picture', picture);
    return this.http.post(`${this.userUrl}/${user.id}/avatar`, formData, {withCredentials: true}) as Observable<ServerResponse>;
  }
}
