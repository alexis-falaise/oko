import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';


import { Proposal } from '@models/post/proposal.model';
import { PostService } from '@core/post.service';
import { UiService } from '@core/ui.service';

@Injectable()
export class ProposalPayResolver implements Resolve<Proposal> {

    constructor(
        private postService: PostService,
        private router: Router,
        private uiService: UiService
    ) {}

    resolve(route): Observable<Proposal> {
        const send = (observer, data) => {
            observer.next(data);
            observer.complete();
        };
        const proposalId = <string>route.paramMap.get('id');
        return Observable.create(observer => {
            this.postService.getProposalById(proposalId)
            .subscribe((proposal) => {
                this.postService.getAllProposalSubPosts(proposal)
                .subscribe((completeProposal) => {
                    send(observer, completeProposal);
                }, (error) => {
                    this.uiService.serverError(error);
                    this.router.navigate(['/home']);
                });
            }, (error) => {
                this.uiService.serverError(error);
                this.router.navigate(['/home']);
            });
        });
    }

}
