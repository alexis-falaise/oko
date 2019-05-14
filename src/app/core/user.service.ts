import { Injectable } from '@angular/core';
import { HttpClient, HttpProgressEvent, HttpEventType } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '@models/user.model';
import { environment } from '@env/environment';
import { ServerResponse } from '@models/app/server-response.model';
import { BankDetails } from '@models/balance/bank-details.model';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private serverUrl = environment.serverUrl;
  private userUrl = `${this.serverUrl}/user`;
  private currentUser = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private uiService: UiService,
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

  addAccount(account: BankDetails): Observable<User> {
    return Observable.create(observer => {
      this.getCurrentUser().subscribe((user) => {
        this.http.put(`${this.userUrl}/${user.id}/account`, account, {withCredentials: true})
        .subscribe((response: ServerResponse) => {
            observer.next(response.data);
            observer.complete();
        }, (error) => {
          let message: string;
          if (error.status === 409) {
            message = 'Ce compte existe déjà';
          }
          this.uiService.serverError(error, message);
        });
      }, (error) => this.uiService.serverError(error));
    });
  }

  editAccount(account: BankDetails): Observable<User> {
    return Observable.create(observer => {
      this.getCurrentUser().subscribe((user) => {
        this.http.put(`${this.userUrl}/${user.id}/account/${account.iban}/edit`, account, {withCredentials: true})
        .subscribe((response: ServerResponse) => {
            observer.next(response.data);
            observer.complete();
        }, (error) => this.uiService.serverError(error));
      }, (error) => this.uiService.serverError(error));
    });
  }

  removeAccount(account: BankDetails): Observable<User> {
    return Observable.create(observer => {
      this.getCurrentUser().subscribe((user) => {
        this.http.delete(`${this.userUrl}/${user.id}/account/${account.iban}`, {withCredentials: true})
        .subscribe((response: ServerResponse) => {
            observer.next(response.data);
            observer.complete();
        }, (error) => this.uiService.serverError(error));
      }, (error) => this.uiService.serverError(error));
    });
  }

  uploadUserAvatar(picture: File, user: User): Observable<ServerResponse> {
    const formData = new FormData();
    formData.append('picture', picture);
    return this.http.post(`${this.userUrl}/${user.id}/avatar`, formData, {withCredentials: true}) as Observable<ServerResponse>;
  }
}
