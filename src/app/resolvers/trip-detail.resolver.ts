import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, zip, of, timer, Subject } from 'rxjs';
import { map, catchError, takeUntil } from 'rxjs/operators';

import { PexelsService } from '@core/pexels.service';
import { PostService } from '@core/post.service';
import { UserService } from '@core/user.service';

import { Trip } from '@models/post/trip.model';
import { User } from '@models/user.model';
import { cityIsFamous } from '@static/famous-cities';

// Timeout for offline mode
const timeout = 2000;
interface TripDetailData {
    trip: Trip;
    user: User;
    background?: string;
}

@Injectable()
export class TripDetailResolver implements Resolve<TripDetailData> {

    constructor(
        private pexels: PexelsService,
        private postService: PostService,
        private userService: UserService,
    ) {}

    resolve(route): Observable<TripDetailData> {
        const tripId = route.paramMap.get('id');
        const send = (observer, data) => {
            observer.next(data);
            observer.complete();
        };
        const stopLoad = new Subject();
        timer(timeout).subscribe(() => stopLoad.next());
        return Observable.create(observer => {
            zip(
                this.postService.getTripById(tripId),
                this.userService.getCurrentUser()
                .pipe(catchError((err, caught) => of(caught)))
            )
            .pipe(map(([trip, user]) => ({trip, user})))
            .subscribe((tripDetail: TripDetailData) => {
                // Handle offline mode with a timeout
                stopLoad.subscribe(() => {
                    send(observer, tripDetail);
                });
                const imageSearch = cityIsFamous(tripDetail.trip.to.airport.city)
                ? tripDetail.trip.to.airport.city : tripDetail.trip.to.airport.country;
                this.pexels.getBackgroundPicture(imageSearch, 'large2x')
                .pipe(takeUntil(stopLoad))
                .subscribe((picture: string) => {
                    tripDetail.background = picture;
                    send(observer, tripDetail);
                }, () => send(observer, tripDetail));
            });
        });
    }

}
