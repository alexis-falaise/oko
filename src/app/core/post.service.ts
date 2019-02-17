import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as moment from 'moment';

import { Filter } from '@models/app/filter.model';
import { Post } from '@models/post/post.model';
import { Trip } from '@models/post/trip.model';
import { Request } from '@models/post/request.model';
import { ServerResponse } from '@models/app/server-response.model';
import { Id } from '@models/id.model';

import { environment } from '@env/environment';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postUrl = `${environment.serverUrl}/post`;
  private tripUrl = `${environment.serverUrl}/trip`;
  private requestUrl = `${environment.serverUrl}/request`;
  private trips = new BehaviorSubject<Array<Trip>>(null);
  private requests = new BehaviorSubject<Array<Request>>(null);

  posts = new BehaviorSubject<Array<Post>>(null);
  postDraft: Post = null;
  tripDraft = null;
  currentFilter = new Filter();

  constructor(private http: HttpClient) { }

  // Subscriptions

  onPosts(): Observable<Array<Post>> {
    return this.posts.asObservable();
  }

  onTrips(): Observable<Array<Trip>> {
    return this.trips.asObservable();
  }

  onRequests(): Observable<Array<Request>> {
    return this.requests.asObservable();
  }

  // Getters

  /**
   * Fetch all existing posts.
   * Cold observable, subscribe to onPosts() for results
   * @param filter : Filter object containing location and/or item
   */
  getPosts(filter?: Filter) {
    this.http.get(`${this.postUrl}${ filter ? '?location=' + filter.location : '' }`, {withCredentials: true})
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.posts.next(response.data.map(post => new Post(post)));
      }
    });
  }

  /**
   * Fetch all existing trips.
   * Cold observable, subscribe to onTrips() for results
   * @param filter: Filter object containning location and/or item
   */
  getTrips(filter?: Filter) {
    const nextQuery = new Subject();
    let queryString = '';
    filter = filter || this.currentFilter;
    if (filter) {
      this.currentFilter = filter;
      queryString = Object.keys(filter).reduce((query, key, index) => {
        return `${query}${index ? '&' : ''}${filter[key] ? key + '=' + filter[key] : '' }`;
      }, '?');
    }
    this.http.get(`${this.tripUrl}${queryString}`, {withCredentials: true})
    .pipe(takeUntil(nextQuery))
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        const trips: Array<Trip> = response.data
        .map((trip: Trip) => new Trip(trip))
        .sort((first, second) => {
          if (moment(first.date).isBefore(second.date)) {
            return -1;
          } else {
            return 1;
          }
        });
        this.trips.next(trips);
        nextQuery.next(true);
      }
    });
  }

  /**
   * Fetch all existing requests.
   * Cold observable, subscribe to onRequests() for results
   * @param filter: Filter object containning location and/or item
   */
  getRequests(filter?: Filter) {
    this.http.get(`${this.requestUrl}${ filter ? '?item=' + filter.item : '' }`, {withCredentials: true})
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.requests.next(response.data.map(request => new Request(request)));
      }
    });
  }

  /**
   * Get a post by id
   * @param id : Post unique identifier
   */
  getPostById(id: string): Observable<Post> {
    return this.http.get(`${this.postUrl}/${id}`, {withCredentials: true}) as Observable<Post>;
  }

  /**
   * Get a trip by id
   * @param id : Trip unique identifier
   */
  getTripById(id: number): Observable<Trip> {
    return this.http.get(`${this.tripUrl}/${id}`, {withCredentials: true}) as Observable<Trip>;
  }

  /**
   * Get a request by id
   * @param id : Request unique identifier
   */
  getRequestById(id: number): Observable<Request> {
    return this.http.get(`${this.requestUrl}/${id}`, {withCredentials: true}) as Observable<Request>;
  }

  // Creators

  createPost(post: Post | Array<Post>): Observable<ServerResponse> {
    return this.http.post(this.postUrl, post, {withCredentials: true}) as Observable<ServerResponse>;
  }

  createTrip(trip: Trip | Array<Trip>): Observable<ServerResponse> {
    return this.http.post(this.tripUrl, trip, {withCredentials: true}) as Observable<ServerResponse>;
  }

  createRequest(request: Request | Array<Request>): Observable<ServerResponse> {
    return this.http.post(this.requestUrl, request, {withCredentials: true}) as Observable<ServerResponse>;
  }

  // Modifiers

  updatePost(post: Post): Observable<ServerResponse> {
    return this.http.put(`${this.postUrl}/${post.id}`, post, {withCredentials: true}) as Observable<ServerResponse>;
  }

  updateTrip(trip: Trip): Observable<ServerResponse> {
    return this.http.put(`${this.tripUrl}/${trip.id}`, trip, {withCredentials: true}) as Observable<ServerResponse>;
  }

  updateRequest(request: Request): Observable<ServerResponse> {
    return this.http.put(`${this.requestUrl}/${request.id}`, request, {withCredentials: true}) as Observable<ServerResponse>;
  }

  saveTripDraft(tripDraft) {
    this.tripDraft = tripDraft;
  }

  getTripDraft() {
    return this.tripDraft;
  }

  deleteTripDraft() {
    this.tripDraft = null;
  }

  draftPost(filter: Filter) {
    this.postDraft = new Request({
      items: [{label : filter.item}],
      location: {label: filter.location}}
    );
  }

  getCurrentDraft(): Post {
    return this.postDraft;
  }

  getTripFilters() {
    return this.currentFilter;
  }

  resetTripFilters() {
    this.currentFilter = new Filter();
  }

  // TESTING PURPOSES

  deleteAllPosts() {
    this.http.get(`${this.postUrl}/delete`, {withCredentials: true});
    this.http.get(`${this.tripUrl}/delete`, {withCredentials: true});
    this.http.get(`${this.requestUrl}/delete`, {withCredentials: true});
  }

}
