import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/user.service';
import { PostService } from '@core/post.service';
import { Request } from '@models/post/request.model';

@Component({
  selector: 'app-account-request',
  templateUrl: './account-request.component.html',
  styleUrls: ['./account-request.component.scss']
})
export class AccountRequestComponent implements OnInit {
  requests: Array<Request> = null;

  constructor(
    private userService: UserService,
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.postService.getRequestByAuthor(user.id)
        .subscribe(requests => {
          if (requests) {
            this.requests = requests;
          }
        });
      }
    });
  }

}
