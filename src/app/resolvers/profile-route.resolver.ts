import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { PostService } from '@core/post.service';

import { Route } from '@models/route.model';

@Injectable()
export class ProfileRouteResolver implements Resolve<Route> {

    constructor(private postService: PostService) { }
    resolve(route): Observable<Route> {
        const tripId = <string>route.paramMap.get('trip');
        return this.postService.getTripRoute(tripId);
    }

}
