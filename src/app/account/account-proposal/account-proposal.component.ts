import { Component, OnInit } from '@angular/core';
import { PostService } from '@core/post.service';
import { Proposal } from '@models/post/proposal.model';
import { UserService } from '@core/user.service';
import { UiService } from '@core/ui.service';
import { User } from '@models/user.model';
import { forkJoin } from 'rxjs';
import { Trip } from '@models/post/trip.model';

@Component({
  selector: 'app-account-proposal',
  templateUrl: './account-proposal.component.html',
  styleUrls: ['./account-proposal.component.scss']
})
export class AccountProposalComponent implements OnInit {
  currentUser: User;
  receivedFromTrip: Array<Proposal>;
  receivedFromRequest: Array<Proposal>;
  sentAboutTrip: Array<Proposal>;
  sentAboutRequest: Array<Proposal>;

  constructor(
    private postService: PostService,
    private uiService: UiService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser()
    .subscribe((user: User) => {
      if (user) {
        this.currentUser = user;
        this.postService.getReceivedProposalsByReceiver(user)
        .subscribe(proposals => {
          forkJoin(proposals.map(proposal => this.postService.getAllProposalSubPosts(proposal)))
          .subscribe((outputProposals: Array<Proposal>) => {
            console.log('Get received proposals by receiver', outputProposals);
            this.receivedFromTrip = outputProposals.filter(proposal => {
              return proposal.from instanceof Trip;
            });
            this.receivedFromRequest = outputProposals.filter(proposal => {
              return proposal.from instanceof Request;
            });
          });
        });
        this.postService.getAllSentProposalsByAuthor(user)
        .subscribe(proposals => {
          console.log('Get send proposals by author', proposals);
          this.sentAboutTrip = proposals.filter(proposal => {
            return proposal.from instanceof Trip;
          });
          this.sentAboutRequest = proposals.filter(proposal => {
            return proposal.from instanceof Request;
          });
        })
      }
    }, (error) => this.uiService.serverError(error));
  }

}
