import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

import { environment } from '@env/environment';
import { UiService } from './ui.service';

import { Thread } from '@models/messenger/thread.model';
import { User } from '@models/user.model';
import { ServerResponse } from '@models/app/server-response.model';
import { Message } from '@models/messenger/message.model';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  thread = new BehaviorSubject<Thread>(new Thread({}));
  contacts = new BehaviorSubject<Array<User>>([]);
  threadChange = new Subject();
  threads = new BehaviorSubject<Array<Thread>>(null);
  currentUser: User;
  private messengerUrl = `${environment.serverUrl}/messenger`;

  constructor(
    private http: HttpClient,
    private uiService: UiService,
    private userService: UserService,
    private authService: AuthService,
    private snack: MatSnackBar,
    private router: Router,
    private socket: Socket
  ) {
      this.getCurrentUser();
      authService.onStatus().subscribe(status => {
      if (status.status) {
        if (!this.currentUser) {
          this.getCurrentUser();
        }
      } else {
        this.resetCurrentUser();
      }
    });
  }

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


  /**
   * Get a thread in relation with a given contact
   * @param contact: Related contact
   * @param user: Current User (optional)
   */
  getContactThread(contact: User, user: User = this.currentUser) {
    if (user) {
      if (user.id !== contact.id) {
        const url = `${this.messengerUrl}/thread/user/${user.id}/contact/${contact.id}`;
        console.log('Getting contact thread', contact, user);
        this.getThreadByUrl(url);
      } else {
        this.snack.open('Vous êtes actuellement en relation', 'Ah oui', {duration: 3000});
      }
    } else {
      const snackRef = this.snack.open('Connectez-vous', 'Connexion', {duration: 3000});
      snackRef.onAction().subscribe(() => this.router.navigate(['/oneclick']));
    }
  }

  /**
   * Gets all thread of a given user.
   * Cold observable, subscribe to onThreads() to fech results.
   * Returns an empty array if server returns a 200 status with no data.
   * @param user : user object
   */
  getThreads(user: User = this.currentUser) {
    this.http.get(`${this.messengerUrl}/thread/user/${user.id}`, {withCredentials: true})
    .subscribe((threads: Array<Thread>) => {
      if (threads && threads.length) {
        const resultThreads = threads.map(thread => new Thread(thread, this.currentUser));
        this.threads.next(resultThreads);
      } else {
        this.threads.next(threads);
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
    return this.http.post(
                `${this.messengerUrl}/thread/${thread.id}/message`,
                message,
                {withCredentials: true}) as Observable<ServerResponse>;
  }

  /**
   * Adds a user to an existing thread
   * @param thread : thread object (pass on new Thread({id: id}) if you only have id on hand)
   * @param user : user object
   */
  addUserToThread(thread: Thread, user: User = this.currentUser): Observable<ServerResponse> {
    return this.http.post(`${this.messengerUrl}/thread/${thread.id}/user`,
                user, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /**
   * Deletes a thread
   * @param thread : thread object (pass on new Thread({id: id}) if you only have id on hand)
   */
  deleteThread(thread: Thread): Observable<ServerResponse> {
    return Observable.create(observer => {
      this.http.delete(`${this.messengerUrl}/thread/${thread.id}`, {withCredentials: true})
      .subscribe((response: ServerResponse) => {
        if (response.status) {
          const removedThread = response.data;
          const threads = this.threads.getValue().filter(listThread => listThread.id !== removedThread._id);
          this.threads.next(threads);
        }
        observer.next(response);
        observer.complete();
      }, (error) => {
        this.uiService.serverError(error.error);
        observer.next(error.error);
        observer.complete();
      });
    });
  }

  /**
   * Get contacts of a given user
   * Contacts are oko users that were invovled in a proposal with the given user
   * @param user : concerned user
   */
  getContacts(user: User = this.currentUser) {
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

  /**
   * Resets
   */

  resetThread() {
    this.disconnectCurrentThread();
    this.thread.next(null);
  }

  resetThreads() {
    this.disconnectCurrentThread();
    this.threads.next(null);
  }

  resetContacts() {
    this.contacts.next(null);
  }

  /**
   * Remove listeners of the currentThread and trigger a change in Thread
   */
  disconnectCurrentThread() {
    const currentThread = this.thread.getValue();
    if (currentThread) {
      this.socket.removeListener(`message/new/${currentThread.id}`);
      this.threadChange.next();
    }
  }

  /**
   * Refresh a given thread by push the input message
   * @param thread : Given thread (check purpose)
   * @param message : New message to add to thread
   */
  refreshThread(thread: Thread, message: Message) {
    const currentThread = this.thread.getValue();
    if (currentThread && currentThread.id === thread.id) {
      const formattedMessage = new Message(message, this.currentUser);
      const messageIndex = currentThread.messages.findIndex(threadMessage => threadMessage._id === message._id);
      if (messageIndex === -1) {
        currentThread.messages.push(formattedMessage);
      }
      this.thread.next(currentThread);
    }
  }

  /**
   * Refresh a particular message of a given thread
   * @param thread : Given thread (check purpose)
   * @param message : Message to update
   */
  refreshThreadMessage(thread: Thread, message: Message) {
    const currentThread = this.thread.getValue();
    if (currentThread && currentThread.id === thread.id) {
      const messageIndex = currentThread.messages.findIndex(threadMessage => threadMessage._id === message._id);
      currentThread.messages[messageIndex] = new Message(message, this.currentUser);
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
    .subscribe((response: any) => {
      this.disconnectCurrentThread();
      if (response) {
        let thread;
        if (response.status) {
          thread = response.data;
        } else {
          thread = response;
        }
        this.router.navigate(['messages', 'thread', thread.id || thread._id]);
        this.thread.next(new Thread(thread, this.currentUser));
      } else {
          this.thread.next(null);
      }

    }, (error: HttpErrorResponse) => this.uiService.serverError(error));
  }

  private getCurrentUser() {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  private resetCurrentUser() {
    this.currentUser = null;
  }
}
