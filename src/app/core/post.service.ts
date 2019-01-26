import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as moment from 'moment';

import { Filter } from '@models/app/filter.model';
import { Post } from '@models/post/post.model';
import { Trip } from '@models/post/trip.model';
import { Request } from '@models/post/request.model';
import { ServerResponse } from '@models/app/server-response.model';
import { Id } from '@models/id.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postUrl = `${environment.serverUrl}/post`;
  private tripUrl = `${environment.serverUrl}/trip`;
  private requestUrl = `${environment.serverUrl}/request`;
  private trips = new BehaviorSubject<Array<Trip>>(null);
  private requests = new BehaviorSubject<Array<Request>>(null);

  postData = [new Trip({
    user: {
      firstname: 'Alex',
      lastname: 'Andre',
      email: 'alex@andre.com',
      password: 'alexandre',
      avatar: 'user-alex.png',
    },
    submitDate: moment(),
    from: {
      label: 'Paris',
      airport: {
        label: 'Paris CDG',
        name: 'Aéroport Paris Charles de Gaulle',
        code: 'CDG',
      },
      timezone: 1,
    },
    to: {
      label: 'Santa Cruz',
      airport: {
        label: 'Santa Cruz Viru Viru',
        name: 'Viru Viru',
        code: 'VIR',
      },
      timezone: -4,
    },
    date: moment().set({year: 2019, month: 0, day: 20}),
    weight: 2.5,
    airportDrop: true,
    cabinOnly: true,
  }),
  new Trip({
    user: {
      firstname: 'Benjamin',
      lastname: 'Min',
      email: 'benja@min.com',
      password: 'alexandre',
    },
    submitDate: moment(),
    from: {
      label: 'Dakar',
      airport: {
        label: 'Dakar Sédar-Senghor',
        name: 'Aéroport International Leopold-Sédar-Senghor',
        code: 'DKR',
      },
      timezone: -1,
    },
    to: {
      label: 'Abidjan',
      airport: {
        label: 'Abidjan Houphouët Boigny',
        name: 'Aéroport Felix Houphouët Boigny',
        code: 'ABJ',
      },
      timezone: 0,
    },
    date: moment().set({year: 2019, month: 1, day: 3}),
    airportDrop: true,
    cabinOnly: false,
  }), new Trip({
    user: {
      firstname: 'Melanie',
      lastname: 'Flex',
      email: 'melanie@flex.com',
      password: 'alexandre',
    },
    submitDate: moment(),
    from: {
      label: 'Marseille',
      airport: {
        label: 'Marseille Provence',
        name: 'Aéroport Marseille Provence',
        code: 'MRS',
      },
      timezone: -1,
    },
    to: {
      label: 'Mumbai',
      airport: {
        label: 'Mumbai Chhatrapati Shivaji',
        name: 'Aéroport international Chhatrapati Shivaji',
        code: 'BOM',
      },
      timezone: 0,
    },
    date: moment().set({year: 2019, month: 1, day: 3}),
    weight: 35,
    airportDrop: true,
    cabinOnly: true,
  }), new Trip({
    user: {
      firstname: 'Valentin',
      lastname: 'Tinmarre',
      email: 'val@marre.com',
      password: 'marre',
    },
    submitDate: moment(),
    from: {
      label: 'Nantes',
      airport: {
        label: 'Nantes Atlantique',
        name: 'Aéroport Nantes Atlantique',
        code: 'NTE',
      },
      timezone: -1,
    },
    to: {
      label: 'Le Caire',
      airport: {
        label: 'Cairo International Airport',
        name: 'Aéroport international du Caire',
        code: 'CAI',
      },
      timezone: 0,
    },
    date: moment().set({year: 2019, month: 2, day: 19}),
    weight: 50,
    airportDrop: false,
    cabinOnly: false,
  }), new Trip({
    user: {
      firstname: 'Thibault',
      lastname: 'Frère',
      email: 'thibault@frere.com',
      password: 'alexandre',
    },
    submitDate: moment(),
    from: {
      label: 'Lagos',
      airport: {
        label: 'Lagos',
        name: 'Aéroport international Murtala Muhammed',
        code: 'MRS',
      },
      timezone: -1,
    },
    to: {
      label: 'Kuala Lumpur',
      airport: {
        label: 'KLIA',
        name: 'Aéroport international de Kuala Lumpur',
        code: 'KUL',
      },
      timezone: 0,
    },
    date: moment().set({year: 2019, month: 3, day: 13}),
    height: 150,
    width: 75,
    depth: 40,
    airportDrop: false,
    cabinOnly: true,
  })
  ];
  posts = new BehaviorSubject<Array<Post>>(null);
  postDraft: Post = null;
  tripDraft = null;

  constructor(private http: HttpClient) {
    this.posts.next(this.postData);
  }

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
    this.http.get(`${this.tripUrl}${ filter ? '?location=' + filter.location : '' }`, {withCredentials: true})
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.trips.next(response.data.map(trip => new Trip(trip)));
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

  // App related functions

  filterPosts(filter: Filter) {
    const posts = this.postData;
    const filterLocation = filter.location ? filter.location.toUpperCase() : null;
    const filterItem = filter.item ? filter.item.toUpperCase() : null;

    const filteredPosts = posts.filter(post => {
      let validPost = false;
      if (post instanceof Trip) {
        if (post.to.label.toUpperCase().includes(filterLocation)
            || post.to.airport.label.toUpperCase().includes(filterLocation)
            || post.to.airport.name.toUpperCase().includes(filterLocation)
            || post.to.airport.code.toUpperCase().includes(filterLocation)
        ) {
          validPost = true;
        }
      }
      return validPost;
    });
    this.posts.next(filteredPosts);
  }

  resetPosts() {
    this.posts.next(this.postData);
  }

  saveTripDraft(tripDraft) {
    this.tripDraft = tripDraft;
  }

  getTripDraft() {
    return this.tripDraft;
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

  // TESTING PURPOSES

  createPostBatch() {
    this.postData.forEach(post => {
      this.createTrip(post)
      .subscribe(res => console.log('Res', res));
      this.getTrips();
    });
  }

  deleteAllPosts() {
    this.http.get(`${this.postUrl}/delete`, {withCredentials: true});
    this.http.get(`${this.tripUrl}/delete`, {withCredentials: true});
    this.http.get(`${this.requestUrl}/delete`, {withCredentials: true});
  }

}
