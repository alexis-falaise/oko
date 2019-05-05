import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, forkJoin } from 'rxjs';

import { Proposal } from '@models/post/proposal.model';
import { PostService } from '@core/post.service';
import { UserService } from '@core/user.service';
import { UiService } from '@core/ui.service';
import { User } from '@models/user.model';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AccountProposalResolver implements Resolve<{user: User, proposals: Array<Proposal>}> {
    constructor(
        private postService: PostService,
        private userService: UserService,
        private uiService: UiService,
    ) {}
    resolve(route): Observable<{user: User, proposals: Array<Proposal>}> {
        this.uiService.setMainLoading(true);
        return Observable.create(observer => {
            this.userService.getCurrentUser().subscribe((user) => {
                if (user) {
                    forkJoin([
                        this.postService.getReceivedProposalsByReceiver(user)
                        .pipe(catchError((err, caught) => caught)),
                        this.postService.getAllSentProposalsByAuthor(user)
                        .pipe(catchError((err, caught) => caught)),
                    ]).subscribe((proposals) => {
                        this.uiService.setMainLoading(false);
                        const outputProposals = proposals[0].concat(proposals[1]).map(proposal => new Proposal(proposal));
                        if (proposals) {
                            observer.next({
                                user: user,
                                proposals: outputProposals
                            });
                            observer.complete();
                        } else {
                            observer.next({
                                user: user,
                                proposals: []
                            });
                            observer.complete();
                        }
                    }, (error) => this.uiService.serverError(error));
                } else {
                    this.uiService.connectionSnack();
                }
            }, (error) => this.uiService.serverError(error));
        });
    }
}
