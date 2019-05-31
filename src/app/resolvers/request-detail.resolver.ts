import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, zip, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { PostService } from '@core/post.service';
import { UserService } from '@core/user.service';

import { User } from '@models/user.model';
import { Request } from '@models/post/request.model';

interface RequestDetailData {
    request: Request;
    user: User;
}

@Injectable()
export class RequestDetailResolver implements Resolve<RequestDetailData> {

    constructor(
        private postService: PostService,
        private userService: UserService,
    ) {}

    resolve(route): Observable<RequestDetailData> {
        const requestId = route.paramMap.get('id');
        const send = (observer, data) => {
            observer.next(data);
            observer.complete();
        };
        return Observable.create(observer => {
            zip(
                this.postService.getRequestById(requestId),
                this.userService.getCurrentUser(false)
                .pipe(catchError((err, caught) => of(caught)))
            )
            .pipe(map(([request, user]) => ({request, user})))
            .subscribe((requestDetail: RequestDetailData) => {
                send(observer, requestDetail);
            });
        });
    }

}
