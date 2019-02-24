import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { Item } from '@models/item.model';

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
  requestDraft: Request = null;
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
    filter.afterDate = moment();
    if (filter) {
      this.currentFilter = filter;
      queryString = this.buildQueryString(filter);
    }
    this.http.get(`${this.tripUrl}${queryString}`, {withCredentials: true})
    .pipe(takeUntil(nextQuery))
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        const trips: Array<Trip> = response.data
        .map((trip: Trip) => new Trip(trip))
        .sort((first, second) =>  moment(first.date).isBefore(second.date) ? -1 : 1);
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
    const nextQuery = new Subject();
    let queryString = '';
    filter = filter || this.currentFilter;
    filter.afterDate = moment();
    if (filter) {
      this.currentFilter = filter;
      queryString = this.buildQueryString(filter);
    }
    this.http.get(`${this.requestUrl}${queryString}`, {withCredentials: true})
    .pipe(takeUntil(nextQuery))
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        const requests = response.data
        .map(request => new Request(request))
        .sort((first, second) => moment(first.date).isBefore(second.date) ? -1 : 1);
        this.requests.next(requests);
        nextQuery.next(true);
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
  getTripById(id: string): Observable<Trip> {
    return this.http.get(`${this.tripUrl}/${id}`, {withCredentials: true}) as Observable<Trip>;
  }

  /**
   * Get a trip by author id
   * @param id : User unique identifier
   */
  getTripByAuthor(id: string): Observable<Array<Trip>> {
    return this.http.get(`${this.tripUrl}/author/${id}`, {withCredentials: true}) as Observable<Array<Trip>>;
  }

  /**
   * Get a request by id
   * @param id : Request unique identifier
   */
  getRequestById(id: string): Observable<Request> {
    return this.http.get(`${this.requestUrl}/${id}`, {withCredentials: true}) as Observable<Request>;
  }

  /**
   * Get a request by author id
   * @param id : User that authored the request unique identifier
   */
  getRequestByAuthor(id: string): Observable<Array<Request>> {
    return this.http.get(`${this.requestUrl}/author/${id}`, {withCredentials: true}) as Observable<Array<Request>>;
  }

  /**
   * Get a request by trip id given an author id
   * @param authorId : Author unique identifier
   * @param tripId : Trip unique identifier
   */
  getRequestByTrip(authorId: string, tripId: string): Observable<Array<Request>> {
    return this.http.get(`${this.requestUrl}/author/${authorId}/trip/${tripId}`, {withCredentials: true}) as Observable<Array<Request>>;
  }

  /**
   * Get items by author id
   * @param id : User that created the items unique identifier
   */
  getItemByAuthor(id: string): Observable<Array<Item>> {
    return this.http.get(`${this.requestUrl}/author/${id}/item`, {withCredentials: true}) as Observable<Array<Item>>;
  }

  // Creators

  createPost(post: Post | Array<Post>): Observable<ServerResponse> {
    return this.http.post(this.postUrl, post, {withCredentials: true}) as Observable<ServerResponse>;
  }

  createTrip(trip: Trip | Array<Trip>): Observable<ServerResponse> {
    this.deleteTripDraft();
    return this.http.post(this.tripUrl, trip, {withCredentials: true}) as Observable<ServerResponse>;
  }

  createRequest(request: Request | Array<Request>): Observable<ServerResponse> {
    console.log('Create request', request);
    this.deleteRequestDraft();
    return this.http.post(this.requestUrl, request, {withCredentials: true}) as Observable<ServerResponse>;
  }

  // Modifiers

  updatePost(post: Post): Observable<ServerResponse> {
    return this.http.put(`${this.postUrl}/${post.id}`, post, {withCredentials: true}) as Observable<ServerResponse>;
  }

  updateTrip(trip: Trip): Observable<ServerResponse> {
    this.deleteTripDraft();
    return this.http.put(`${this.tripUrl}/${trip.id}`, trip, {withCredentials: true}) as Observable<ServerResponse>;
  }

  updateRequest(request: Request): Observable<ServerResponse> {
    this.deleteRequestDraft();
    return this.http.put(`${this.requestUrl}/${request.id}`, request, {withCredentials: true}) as Observable<ServerResponse>;
  }

  closeRequest(id: string): Observable<ServerResponse> {
    return this.http.put(`${this.requestUrl}/${id}/close`, {withCredentials: true}) as Observable<ServerResponse>;
  }

  validateRequest(id: string): Observable<ServerResponse> {
    return this.http.put(`${this.requestUrl}/${id}/validate`, {withCredentials: true}) as Observable<ServerResponse>;
  }

  // Deleters

  removePost(post: Post): Observable<ServerResponse> {
    return this.http.delete(`${this.postUrl}/${post.id}`, {withCredentials: true}) as Observable<ServerResponse>;
  }

  removeTrip(trip: Trip): Observable<ServerResponse> {
    return this.http.delete(`${this.tripUrl}/${trip.id}`, {withCredentials: true}) as Observable<ServerResponse>;
  }

  removeRequest(request: Request): Observable<ServerResponse> {
    return this.http.delete(`${this.requestUrl}/${request.id}`, {withCredentials: true}) as Observable<ServerResponse>;
  }

  // In app functions

  saveTripDraft(tripDraft) {
    this.tripDraft = tripDraft;
  }

  getTripDraft() {
    return this.tripDraft;
  }

  deleteTripDraft() {
    this.tripDraft = null;
  }

  saveRequestDraft(requestDraft) {
    this.requestDraft = requestDraft;
  }

  getRequestDraft() {
    return this.requestDraft;
  }

  deleteRequestDraft() {
    this.requestDraft = null;
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

  private buildQueryString(filter: Filter) {
    return Object.keys(filter).reduce((query, key, index) => {
      return `${query}${index ? '&' : ''}${filter[key] ? key + '=' + filter[key] : '' }`;
    }, '?');
  }

}
