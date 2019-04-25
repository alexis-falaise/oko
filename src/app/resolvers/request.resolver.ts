import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { PostService } from '@core/post.service';

import { Request } from '@models/post/request.model';

@Injectable()
export class RequestResolver implements Resolve<Request> {

    constructor(private postService: PostService) {}

    resolve(route): Observable<Request> {
        const requestId = route.paramMap.get('id');
        const send = (observer, data) => {
            observer.next(data);
            observer.complete();
        };
        return Observable.create(observer => {
            this.postService.getRequestById(requestId)
            .subscribe((request: Request) => {
                send(observer, request);
            });
        });
    }

}
