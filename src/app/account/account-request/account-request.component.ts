import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import * as moment from 'moment';

import { PostService } from '@core/post.service';
import { UserService } from '@core/user.service';

import { Request } from '@models/post/request.model';
import { UiService } from '@core/ui.service';
import { RequestService } from 'app/post/request/request.service';

@Component({
  selector: 'app-account-request',
  templateUrl: './account-request.component.html',
  styleUrls: ['../account-post.component.scss']
})
export class AccountRequestComponent implements OnInit {
  requests: Array<Request> = [];
  hasDraft = false;
  loading = false;
  localLoading = new Subject<boolean>();

  constructor(
    private userService: UserService,
    private postService: PostService,
    private uiService: UiService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.onLocalLoading().subscribe(state => this.loadingDisplay(state));
    this.uiService.setLoading(true);
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.setLocalLoading(true);
         this.postService.getRequestByAuthor(user.id)
        .subscribe(requests => {
          this.uiService.setLoading(false);
          this.setLocalLoading(false);
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
        }, () => this.uiService.setLoading(false));
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

  private onLocalLoading() {
    return this.localLoading.asObservable();
  }

  private setLocalLoading(state: boolean) {
    this.localLoading.next(state);
  }

  private loadingDisplay(state: boolean) {
    this.requests = state ? [new Request({}), new Request({}), new Request({})] : [];
  }

}
