import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, forkJoin, Observer, of, zip } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import * as moment from 'moment';

import { environment } from '@env/environment';
import { UserService } from './user.service';

import { Filter } from '@models/app/filter.model';
import { Post } from '@models/post/post.model';
import { Trip } from '@models/post/trip.model';
import { Request } from '@models/post/request.model';
import { ServerResponse } from '@models/app/server-response.model';
import { Item } from '@models/item.model';
import { UiService } from './ui.service';
import { User } from '@models/user.model';
import { Proposal } from '@models/post/proposal.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postUrl = `${environment.serverUrl}/post`;
  private tripUrl = `${environment.serverUrl}/trip`;
  private requestUrl = `${environment.serverUrl}/request`;
  private proposalUrl = `${environment.serverUrl}/proposal`;
  private trips = new BehaviorSubject<Array<Trip>>(null);
  private requests = new BehaviorSubject<Array<Request>>(null);

  posts = new BehaviorSubject<Array<Post>>(null);
  postDraft: Post = null;
  tripDraft = null;
  requestDraft: Request = null;
  currentTripFilter = new Filter();
  currentRequestFilter = new Filter();

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private uiService: UiService,
  ) { }

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

  /**
   *
   * GETTERS
   *
   *
   *
   *
   */

  /**
   * Fetch all existing posts.
   * Cold observable, subscribe to onPosts() for results
   * @param filter : Filter object containing location and/or item
   */
  getPosts(filter?: Filter) {
    this.uiService.setLoading(true);
    this.http.get(`${this.postUrl}${ filter ? '?location=' + filter.location : '' }`, {withCredentials: true})
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.uiService.setLoading(false);
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
    this.uiService.setLoading(true);
    let queryString = '';
    filter = filter || this.currentTripFilter;
    filter.afterDate = moment();
    if (filter) {
      queryString = this.buildQueryString(filter);
    }
    this.http.get(`${this.tripUrl}${queryString}`, {withCredentials: true})
    .pipe(takeUntil(nextQuery))
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        const trips: Array<Trip> = response.data;
        delete filter.afterDate;
        this.currentTripFilter = filter;
        this.getTripsUserStats(trips, this.trips);
      }
      nextQuery.next(true);
      this.uiService.setLoading(false);
    });
  }

  /**
   * Fetch all existing requests.
   * Cold observable, subscribe to onRequests() for results
   * @param filter: Filter object containning location and/or item
   */
  getRequests(filter?: Filter) {
    this.uiService.setLoading(true);
    const nextQuery = new Subject();
    let queryString = '';
    filter = filter || this.currentRequestFilter;
    filter.afterDate = moment();
    if (filter) {
      queryString = this.buildQueryString(filter);
    }
    this.http.get(`${this.requestUrl}${queryString}`, {withCredentials: true})
    .pipe(takeUntil(nextQuery))
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        const requests = response.data;
        delete filter.afterDate;
        this.currentRequestFilter = filter;
        this.getRequestsUserStats(requests, this.requests);
        nextQuery.next(true);
      }
      this.uiService.setLoading(false);
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
    return Observable.create(observer => {
      this.http.get(`${this.tripUrl}/${id}`, {withCredentials: true})
      .subscribe(
        (trip: Trip) => this.getTripUserStats(trip, observer),
        (error: HttpErrorResponse) => this.uiService.serverError(error));
    });
  }

  /**
   * Get a trip by author id
   * @param id : User unique identifier
   */
  getTripByAuthor(id: string): Observable<Array<Trip>> {
    return Observable.create(observer => {
      this.http.get(`${this.tripUrl}/author/${id}`, {withCredentials: true})
      .subscribe((trips: Array<Trip>) => {
        if (trips && trips.length) {
          forkJoin(trips.map(trip => {
            return Observable.create(tripObserver => this.getTripUserStats(trip, tripObserver))
            .pipe(catchError((err, caught) => of(caught)));
          }))
          .subscribe((outputTrips: Array<Trip>) => {
            const resultingTrips = outputTrips.sort((first, second) =>  {
              return moment(first.date).isBefore(second.date) ? -1 : 1;
            });
            observer.next(resultingTrips);
            observer.complete();
          });
        } else {
          observer.next(trips);
          observer.complete();
        }
      });
    });
  }

  /**
   * Get a request by id
   * @param id : Request unique identifier
   */
  getRequestById(id: string): Observable<Request> {
    return Observable.create(observer => {
      this.http.get(`${this.requestUrl}/${id}`, {withCredentials: true})
      .subscribe((request: Request) => this.getRequestUserStats(request, observer));
    });
  }

  /**
   * Get a request by author id
   * @param id : User that authored the request unique identifier
   */
  getRequestByAuthor(id: string): Observable<Array<Request>> {
    return Observable.create(observer => {
      this.http.get(`${this.requestUrl}/author/${id}`, {withCredentials: true})
      .subscribe((requests: Array<Request>) => this.getRequestsUserStats(requests, observer));
    });
  }

  /**
   * Get a request by trip id given an author id
   * @param authorId : Author unique identifier
   * @param tripId : Trip unique identifier
   */
  getRequestByTrip(authorId: string, tripId: string): Observable<Array<Request>> {
    return Observable.create(observer => {
      this.http.get(`${this.requestUrl}/author/${authorId}/trip/${tripId}`, {withCredentials: true})
      .subscribe((requests: Array<Request>) => this.getRequestsUserStats(requests, observer));
    });
  }

  /**
   * Get items by author id
   * @param id : User that created the items unique identifier
   */
  getItemByAuthor(id: string): Observable<Array<Item>> {
    return this.http.get(`${this.requestUrl}/author/${id}/item`, {withCredentials: true}) as Observable<Array<Item>>;
  }

  /**
   * Get a proposal by id
   * @param id : proposal unique identifier
   */
  getProposalById(id: string): Observable<Proposal> {
    return this.http.get(`${this.proposalUrl}/${id}`, {withCredentials: true}) as Observable<Proposal>;
  }

  /**
   * Get all proposals sent about a given post (partial proposal - opposite post filled)
   * @param senderPost : Post used to send the proposal (full object)
   */
  getSentProposals(senderPost: Trip | Request): Observable<Array<Proposal>> {
    return Observable.create(observer => {
      this.http.get(`${this.proposalUrl}/from/${senderPost.id}`, {withCredentials: true})
      .subscribe((proposals: Array<any>) => {
        this.getProposalsSubPosts(senderPost, proposals, observer, false);
      }, (err) => {
        observer.next([]);
        observer.complete();
      });
    });
  }

  /**
   * Get all proposals sent about a given post by a specific author (partial proposal - opposite post filled)
   * @param senderPost : Post used to send the proposal (full object)
   * @param author : Author of the proposal (full object)
   */
  getSentProposalsByAuthor(senderPost: Trip | Request, author: User): Observable<Array<Proposal>> {
    return Observable.create(observer => {
      this.http.get(`${this.proposalUrl}/author/${author.id}/from/${senderPost.id}`, {withCredentials: true})
      .subscribe((proposals: Array<any>) => {
        this.getProposalsSubPosts(senderPost, proposals, observer, false);
      }, (err) => {
        observer.next([]);
        observer.complete();
      });
    });
  }

  /**
   * Get all proposals sent by a given author (full proposal)
   * @param author : author of the requested proposals
   */
  getAllSentProposalsByAuthor(author: User): Observable<Array<Proposal>> {
    return Observable.create(observer => {
      this.http.get(`${this.proposalUrl}/author/${author.id}`, {withCredentials: true})
      .subscribe((proposals: Array<any>) => {
        if (proposals && proposals.length) {
          forkJoin(proposals.map(proposal => this.getAllProposalSubPosts(proposal)))
          .subscribe((outputProposals: Array<Proposal>) => {
            observer.next(outputProposals);
            observer.complete();
          }, (error) => {
            observer.next([]);
            observer.complete();
          });
        } else {
          observer.next([]);
          observer.complete();
        }
      }, (err) => {
        observer.next([]);
        observer.complete();
      });
    });
  }

  /**
   * Get all received proposal for a given post (partial proposal - opposite post filled)
   * @param receptorPost : Post receiving the proposal (full Object)
   */
  getReceivedProposals(receptorPost: Trip | Request): Observable<Array<Proposal>> {
    return Observable.create(observer => {
      this.http.get(`${this.proposalUrl}/to/${receptorPost.id}`, {withCredentials: true})
      .subscribe((proposals: Array<any>) => {
        this.getProposalsSubPosts(receptorPost, proposals, observer, true);
      }, (err) => {
        observer.next([]);
        observer.complete();
      });
    });
  }

  /**
   * Get all received proposals for a given post from a specific author (partial proposal - opposite post filled)
   * @param receptorPost : Post receiving the proposal (full Object)
   * @param author : Author of the proposal (user)
   */
  getReceivedProposalsByAuthor(receptorPost: Trip | Request, author: User): Observable<Array<Proposal>> {
    return Observable.create(observer => {
      this.http.get(`${this.proposalUrl}/author/${author.id}/to/${receptorPost.id}`, {withCredentials: true})
      .subscribe((proposals: Array<any>) => {
        this.getProposalsSubPosts(receptorPost, proposals, observer, true);
      }, (err) => {
        observer.next([]);
        observer.complete();
      });
    });
  }

  /**
   * Get all received proposals by a given user (full proposals)
   * @param receiver : receiver of the proposal (user)
   */
  getReceivedProposalsByReceiver(receiver: User): Observable<Array<Proposal>> {
    return Observable.create(observer => {
      this.http.get(`${this.proposalUrl}/receiver/${receiver.id}`, {withCredentials: true})
      .subscribe((proposals: Array<Proposal>) => {
        if (proposals && proposals.length) {
          forkJoin(proposals.map(proposal => {
            return this.getAllProposalSubPosts(proposal);
          }))
          .subscribe((outputProposals: Array<Proposal>) => {
            observer.next(outputProposals);
            observer.complete();
          }, () => {
            observer.next([]);
            observer.complete();
          });
        } else {
          observer.next([]);
          observer.complete();
        }
      }, () => {
        observer.next([]);
        observer.complete();
      });
    });
  }

  /**
   * Get unseen proposals by receiver (partial proposals)
   * @param receiver : given receiver
   */
  getUnseenProposalsByReceiver(receiver: User): Observable<Array<Proposal>> {
    return Observable.create(observer => {
      this.http.get(`${this.proposalUrl}/receiver/${receiver.id}/unseen`, { withCredentials: true})
      .subscribe((proposals: Array<Proposal>) => {
        observer.next(proposals);
        observer.complete();
      }, (error) => {
        observer.next([]).
        observer.complete();
      });
    });
  }

  /**
   * Get the sub post of a proposal (fills the unknown only)
   * @param post : currently viewed post
   * @param proposal : proposal object
   * @param observer : observer
   * @param postIsReceiver : whether the current post is a receiver or sender
   */
  getProposalSubPost(post: Trip | Request, proposal: any, observer: Observer<Proposal>, postIsReceiver: boolean) {
    if (post instanceof Trip) {
      this.getRequestById(postIsReceiver ? proposal.from : proposal.to).subscribe((request: Request) => {
        const outputProposal = new Proposal(proposal);
        postIsReceiver ?
        outputProposal.from = new Request(request)
        : outputProposal.to = new Request(request);
        observer.next(outputProposal);
        observer.complete();
      });
    }
    if (post instanceof Request) {
      this.getTripById(postIsReceiver ? proposal.from : proposal.to).subscribe((trip: Trip) => {
        const outputProposal = new Proposal(proposal);
        postIsReceiver ?
        outputProposal.from = new Trip(trip)
        : outputProposal.to = new Trip(trip);
        observer.next(outputProposal);
        observer.complete();
      });
    }
  }

  /**
   * Get sub posts of a proposal (both from and to)
   * @param proposal : proposal object
   * @param observer : call this function from an observable
   */
  getAllProposalSubPosts(proposal: any): Observable<Proposal> {
    return Observable.create(observer => {
      forkJoin([
        this.http.get(`${this.postUrl}/${proposal.from}`, {withCredentials: true})
        .pipe(catchError((err, caught) => of(caught))) as Observable<Post>,
        this.http.get(`${this.postUrl}/${proposal.to}`, {withCredentials: true})
        .pipe(catchError((err, caught) => of(caught))) as Observable<Post>
      ])
      .subscribe((posts: Array<Post>) => {
        proposal.from = posts[0];
        proposal.to = posts[1];
        const outputProposal = new Proposal(proposal);
        observer.next(outputProposal);
        observer.complete();
      }, (error) => {
        observer.next([]);
        observer.complete();
      });
    });
  }

  /************************************************************
   *
   *
   * CREATORS
   *
   *
   ************************************************************/

  createPost(post: Post | Array<Post>): Observable<ServerResponse> {
    return this.http.post(this.postUrl, post, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /**
   * Creates a trip
   * @param trip : Trip to be created (full object)
   */
  createTrip(trip: Trip | Array<Trip>): Observable<ServerResponse> {
    this.deleteTripDraft();
    return this.http.post(this.tripUrl, trip, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /**
   * Creates a proposal from a trip to a request
   * @param proposal: Proposal object
   * It should contain the full trip in the 'from' property (type Trip)
   * and only a reference (id: string) to the request in the 'to' property
   */
  createTripForRequest(proposal: Proposal | any): Observable<ServerResponse> {
    this.deleteTripDraft();
    return Observable.create(observer => {
      const trip = new Trip(proposal.from);
      this.createTrip(trip).subscribe((serverResponse: ServerResponse) => {
        if (serverResponse.status) {
          const createdTrip = new Trip(serverResponse.data);
          proposal.from = createdTrip.id;
          this.http.post(`${this.proposalUrl}`, proposal, {withCredentials: true})
          .subscribe((response: ServerResponse) => {
              observer.next(response);
              observer.complete();
          });
        } else {
          observer.next(serverResponse);
          observer.complete();
        }
      });
    });
  }

  /**
   * Creates a request
   * @param request : Request to be created (full object)
   */
  createRequest(request: Request | Array<Request>): Observable<ServerResponse> {
    this.deleteRequestDraft();
    return this.http.post(this.requestUrl, request, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /**
   * Creates a proposal from a request to a trip
   * @param proposal: Proposal object
   * It should contain the full request in the 'from' property (type Request)
   * and only a reference (id: string) to the trip in the 'to' property
   */
  createRequestForTrip(proposal: Proposal | any): Observable<ServerResponse> {
    this.deleteRequestDraft();
    return Observable.create(observer => {
      const request = new Request(proposal.from);
      this.createRequest(request).subscribe((serverResponse: ServerResponse) => {
        if (serverResponse.status) {
          const createdRequest = new Request(serverResponse.data);
          proposal.from = createdRequest.id;
          this.http.post(`${this.proposalUrl}`, proposal, {withCredentials: true})
          .subscribe((response: ServerResponse) => {
            observer.next(response);
            observer.complete();
          });
        } else {
          observer.next(serverResponse);
          observer.complete();
        }
      });
    });
  }

  /************************************************************
   *
   *
   * MODIFIERS
   *
   *
   ************************************************************/

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

  /************************************************************
   *
   *
   * PROPOSAL MANAGEMENT
   * User management of proposals
   *
   ************************************************************/

  /**
   * Accept a proposal
   * @param id : Proposal id
   */
  acceptProposal(id: string): Observable<ServerResponse> {
    return this.http.put(`${this.proposalUrl}/${id}/accept`, {accepted: true}, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /**
   * Refuse a proposal
   * @param id : Proposal id
   */
  refuseProposal(id: string): Observable<ServerResponse> {
    return this.http.put(`${this.proposalUrl}/${id}/refuse`, {refused: true}, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /**
   * Validate a proposal
   * @param id : Proposal id
   */
  validateProposal(id: string): Observable<ServerResponse> {
    return this.http.put(`${this.proposalUrl}/${id}/validate`, {validated: true}, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /**
   * Close a proposal (cancellation)
   * @param id : Proposal id
   */
  closeProposal(id: string): Observable<ServerResponse> {
    return this.http.put(`${this.proposalUrl}/${id}/close`, {closed: true}, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /**
   * Set a proposal as paid
   * @param id : Proposal id
   */
  payProposal(id: string): Observable<ServerResponse> {
    return this.http.put(`${this.proposalUrl}/${id}/pay`, {paid: true}, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /**
   * Update the bonus of a proposal
   * @param id : Proposal id
   * @param bonus : new bonus value
   */
  updateProposalBonus(id: string, bonus: number): Observable<ServerResponse> {
    return this.http.put(`${this.proposalUrl}/${id}/bonus`, {bonus: bonus}, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /**
   * Update a proposal
   * @param proposal : Proposal object
   */
  updateProposal(proposal: Proposal): Observable<ServerResponse> {
    return this.http.put(`${this.proposalUrl}/${proposal.id}`, proposal, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /************************************************************
   *
   *
   * DELETERS
   *
   *
   ************************************************************/

  /**
   * Removes a post
   * @param post : Post to be removed (full object)
   */
  removePost(post: Post): Observable<ServerResponse> {
    return this.http.delete(`${this.postUrl}/${post.id}`, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /**
   * Removes a trip
   * @param trip : Trip to be removed (full object)
   */
  removeTrip(trip: Trip): Observable<ServerResponse> {
    return this.http.delete(`${this.tripUrl}/${trip.id}`, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /**
   * Removes a request
   * @param request : Request to be removed (full object)
   */
  removeRequest(request: Request): Observable<ServerResponse> {
    return this.http.delete(`${this.requestUrl}/${request.id}`, {withCredentials: true}) as Observable<ServerResponse>;
  }

  /************************************************************
   *
   *
   * IN APP FUNCTIONS
   * Functions used for front-end only, not communicating with the server
   *
   ************************************************************/

  /**
   * Saves a draft in memory (no cache)
   * @param tripDraft : Draft object representing the trip
   */
  saveTripDraft(tripDraft) {
    this.tripDraft = tripDraft;
  }

  /**
   * Getter for trip draft
   */
  getTripDraft() {
    return this.tripDraft;
  }

  /**
   * Removes the trip draft from memory
   */
  deleteTripDraft() {
    this.tripDraft = null;
  }

  /**
   * Saves a draft in memory (no cache)
   * @param requestDraft : Draft object representing the request
   */
  saveRequestDraft(requestDraft) {
    this.requestDraft = requestDraft;
  }

  /**
  * Getter for request draft
  */
  getRequestDraft() {
    return this.requestDraft;
  }

  /**
   * Removes the request draft from memory
   */
  deleteRequestDraft() {
    this.requestDraft = null;
  }

  draftPost(filter: Filter) {
    this.postDraft = new Request({
      items: [{label : filter.item}],
      location: {label: filter.location}}
    );

    const obs = new Observable((observer) => { observer.complete(); });

  }
  getCurrentDraft(): Post {
    return this.postDraft;
  }

  getTripFilters() {
    return this.currentTripFilter;
  }

  resetTripFilters() {
    this.currentTripFilter = new Filter();
  }

  getRequestFilters() {
    return this.currentRequestFilter;
  }

  resetRequestFilters() {
    this.currentRequestFilter = new Filter();
  }

  /************************************************************
   *
   *
   * INFORMATION COMPLETERS
   *
   *
   ************************************************************/

   /**
    * Get stats on the creators of every trip of a given list of trips
    * To be used inside an Observable
    * @param trips : trip list
    * @param observer : Observables's observer
    */
  private getTripsUserStats(trips: Array<Trip>, observer: Observer<Array<Trip>>) {
    if (trips && !trips.length) {
      observer.next([]);
    } else {
      forkJoin(trips.map(trip => Observable.create(tripObserver => this.getTripUserStats(trip, tripObserver))))
      .subscribe((outputTrips: Array<Trip>) => {
        const resultingTrips = outputTrips.sort((first, second) =>  {
          return moment(first.date).isBefore(second.date) ? -1 : 1;
        });
        observer.next(resultingTrips);
      });
    }
  }

  /**
   * Get stats on the creator of a trip
   * @param trip : trip
   * @param observer : Observable's observer
   */
  private getTripUserStats(trip: Trip, observer: Observer<Trip>) {
      if (trip.user && trip.user.id) {
        this.userService.getUserStatsById(trip.user.id)
        .subscribe((user: User) => {
          trip.user = user;
          const outputTrip = new Trip(trip);
          observer.next(outputTrip);
          observer.complete();
        }, (error) => {
          observer.next(null);
          observer.complete();
        });
      } else {
        const outputTrip = new Trip(trip);
        observer.next(outputTrip);
        observer.complete();
      }
  }

  /**
   * Get stats on the creators of every request of a list of requests
   * @param requests : request list
   * @param observer : Observable's observer
   */
  private getRequestsUserStats(requests: Array<Request>, observer: Observer<Array<Request>>) {
    if (requests && !requests.length) {
      observer.next([]);
    } else {
      forkJoin(requests.map(request => Observable.create(requestObserver => {
        return this.getRequestUserStats(request, requestObserver);
      }))).subscribe((outputRequests) => {
        const resultingRequests = outputRequests.sort((first, second) => {
          if (second.urgent) {
            return 1;
          }
          if (!second.submitDate) {
            return -1;
          }
          return moment(first.submitDate).isAfter(second.submitDate) ? -1 : 1;
        });
        observer.next(resultingRequests);
      });
    }
  }

  /**
   * Get stats on the creator of a request
   * @param request : request
   * @param observer : Observable's observer
   */
  private getRequestUserStats(request: Request, observer: Observer<Request>) {
    if (request.user && request.user.id) {
      this.userService.getUserStatsById(request.user.id)
      .subscribe(user => {
        request.user = user;
        observer.next(new Request(request));
        observer.complete();
      });
    } else {
      observer.next(new Request(request));
      observer.complete();
    }
  }

  /**
   * See getProposalSubPost
   * Helper to extend getProposalSubPost function to proposal lists
   * To be used in an Observable
   * @param post : currently viewed post
   * @param proposals : proposals list (set as any to allow uncomplete proposals)
   * @param observer : Observable's observer
   * @param postIsReceiver : Boolean to indicate if currently view post is the receiver of the proposals
   */
  private getProposalsSubPosts(post: Trip | Request, proposals: Array<any>, observer: Observer<Array<Proposal>>, postIsReceiver: boolean) {
    if (proposals && proposals.length) {
      forkJoin(proposals.map(proposal => Observable.create(postObserver => {
        this.getProposalSubPost(post, proposal, postObserver, postIsReceiver);
      }))).subscribe(outputProposals => {
        const resultingProposals = outputProposals.sort((a, b) => {
          return moment(a.date).isBefore(b.date) ? -1 : 1;
        });
        observer.next(resultingProposals);
        observer.complete();
      });
    } else {
      observer.next([]);
      observer.complete();
    }
  }

  private buildQueryString(filter: Filter) {
    return Object.keys(filter).reduce((query, key, index) => {
      return `${query}${index ? '&' : ''}${filter[key] ? key + '=' + filter[key] : '' }`;
    }, '?');
  }

}
