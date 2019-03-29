import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { PostService } from '@core/post.service';
import { UserService } from '@core/user.service';

import { Request } from '@models/post/request.model';
import { UiService } from '@core/ui.service';

@Component({
  selector: 'app-account-request',
  templateUrl: './account-request.component.html',
  styleUrls: ['../account-post.component.scss']
})
export class AccountRequestComponent implements OnInit {
  requests: Array<Request> = [];
  hasDraft = false;
  loading = false;

  constructor(
    private userService: UserService,
    private postService: PostService,
    private uiService: UiService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.uiService.onLoading().subscribe(state => this.setLocalLoading(state));
    this.uiService.setLoading(true);
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.uiService.setLoading(true);
         this.postService.getRequestByAuthor(user.id)
        .subscribe(requests => {
          this.uiService.setLoading(false);
          if (requests) {
            this.requests = requests
            .map(request => new Request(request))
            .sort((a, b) => {
              if (a.closed) {
                return 1;
              }
              if (a.submitDate && !b.submitDate) {
                return -1;
              }
              if (!a.submitDate && b.submitDate) {
                return 1;
              }
              if (!a.submitDate && !b.submitDate) {
                return -1;
              }
              if (a.submitDate && b.submitDate) {
                return moment(a.submitDate).isBefore(b.submitDate) ? 1 : -1;
              }
            });
          }
        });
      }
    });
    this.manageDrafts();
  }

  newRequest() {
    this.router.navigate(['/post/request/new']);
  }

  remove(index: number) {
    this.requests.splice(index, 1);
  }

  deleteDraft() {
    this.postService.deleteRequestDraft();
    this.hasDraft = false;
  }

  private manageDrafts() {
    const draft = this.postService.getRequestDraft();
    this.hasDraft = !!draft;
  }

  private setLocalLoading(state: boolean) {
    this.loading = state;
    this.requests = state ? [new Request({}), new Request({}), new Request({})] : [];
  }

}
