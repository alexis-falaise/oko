import { Component, OnInit } from '@angular/core';
import { PostService } from '@core/post.service';

import { Request } from '@models/post/request.model';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  request: Request = null;

  constructor(
    private postService: PostService
  ) { }

  ngOnInit() {
    const draft = this.postService.getCurrentDraft() as Request;
    if (draft) {
      this.request = draft;
    }
  }

}
