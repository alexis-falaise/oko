import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

import { environment } from '@env/environment';
import { UiService } from './ui.service';

import { Thread } from '@models/messenger/thread.model';
import { User } from '@models/user.model';
import { ServerResponse } from '@models/app/server-response.model';
import { Message } from '@models/messenger/message.model';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  thread = new BehaviorSubject<Thread>(new Thread({}));
  contacts = new BehaviorSubject<Array<User>>([]);
  threadChange = new Subject();
  threads = new BehaviorSubject<Array<Thread>>([]);
  private messengerUrl = `${environment.serverUrl}/messenger`;

  constructor(
    private http: HttpClient,
    private uiService: UiService,
    private router: Router,
    private socket: Socket
  ) { }

  onThread() {
    return this.thread.asObservable();
  }

  onThreads() {
    return this.threads.asObservable();
  }

  onContacts() {
    return this.contacts.asObservable();
  }

  /**
   * Gets a thread by id.
   * Cold observable, subscribe to onThread() to fetch results.
   * Returns null if no thread if server returns a 200 status with no data.
   * @param threadId : Unique id of the thread to retrieve
   */
  getThread(threadId: number) {
    const url = `${this.messengerUrl}/thread/${threadId}`;
    this.getThreadByUrl(url);
  }

  getContactThread(user: User, contact: User) {
    const url = `${this.messengerUrl}/thread/user/${user.id}/contact/${contact.id}`;
    this.getThreadByUrl(url);
  }

  /**
   * Gets all thread of a given user.
   * Cold observable, subscribe to onThreads() to fech results.
   * Returns an empty array if server returns a 200 status with no data.
   * @param user : user object
   */
  getThreads(user: User) {
    this.http.get(`${this.messengerUrl}/thread/user/${user.id}`, {withCredentials: true})
    .subscribe((threads: Array<Thread>) => {
      if (threads && threads.length) {
        const resultThreads = threads.map(thread => new Thread(thread));
        this.threads.next(resultThreads);
      } else {
        this.threads.next([]);
      }
    }, (error: HttpErrorResponse) => this.uiService.serverError(error));
  }

  /**
   * Creates a thread
   * @param thread : thread object
   */
  createThread(thread: Thread): Observable<ServerResponse> {
    return this.http.post(`${this.messengerUrl}/thread`, thread, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /**
   * Creates a new message in an existing thread
   * @param thread : thread object (pass on new Thread({id: id}) if you only have id on hand)
   * @param message : message object
   */
  createMessage(thread: Thread, message: Message): Observable<ServerResponse> {
    console.log('Create a message', thread, message);
    return this.http.post(`${this.messengerUrl}/thread/${thread.id}/message`,
                message, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /**
   * Adds a user to an existing thread
   * @param thread : thread object (pass on new Thread({id: id}) if you only have id on hand)
   * @param user : user object
   */
  addUserToThread(thread: Thread, user: User): Observable<ServerResponse> {
    return this.http.post(`${this.messengerUrl}/thread/${thread.id}/user`,
                user, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /**
   * Get contacts of a given user
   * Contacts are oko users that were invovled in a proposal with the given user
   * @param user : concerned user
   */
  getContacts(user: User) {
    this.http.get(`${this.messengerUrl}/contacts/user/${user.id}`, {withCredentials: true})
    .subscribe((contacts: Array<User>) => {
      if (contacts) {
        this.contacts.next(contacts.map(contact => new User(contact)));
      } else {
        this.contacts.next([]);
      }
    });
  }

  /**
   * Get all oko users
   */
  getUsers(name?: string): Observable<Array<User>> {
    return Observable.create(observer => {
      const query = name ? `?name=${name}` : '';
      this.http.get(`${this.messengerUrl}/users${query}`, {withCredentials: true})
      .subscribe((users: Array<any>) => {
        if (users) {
          const curatedUsers = users.map(user => new User(user));
          observer.next(curatedUsers);
          observer.complete();
        } else {
          observer.next([]);
          observer.complete();
        }
      }, (error) => this.uiService.serverError(error));
    });
  }

  private disconnectCurrentThread() {
    const currentThread = this.thread.getValue();
    this.socket.removeListener(`message/new/${currentThread.id}`);
    this.threadChange.next();
  }

  private refreshThread(thread: Thread, message: Message) {
    const currentThread = this.thread.getValue();
    if (currentThread.id === thread.id) {
      currentThread.messages.push(message);
      this.thread.next(currentThread);
    }
  }

  /**
   * Finds a thread by server url (see endpoints)
   * @param url : Server url for thread search
   * @param creation : Create a thread if not found
   */
  private getThreadByUrl(url: string) {
    this.http.get(url, {withCredentials: true})
    .pipe(takeUntil(this.threadChange))
    .subscribe((thread: Thread) => {
      this.disconnectCurrentThread();
      if (thread) {
          this.router.navigate(['messages', 'thread', thread.id || thread._id]);
          this.thread.next(new Thread(thread));
          this.socket.on(`message/new/${thread.id}`, (message) => {
          this.refreshThread(thread, message);
        });
      } else {
        this.thread.next(null);
      }
    }, (error: HttpErrorResponse) => this.uiService.serverError(error));
  }
}
