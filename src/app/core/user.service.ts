import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '@models/user.model';
import { environment } from '@env/environment';

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

  updateUser(user: User): Observable<Object> {
    return this.http.put(`${this.userUrl}/${user.id}`, user, {withCredentials: true});
  }
}
