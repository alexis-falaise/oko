import { Component, OnInit } from '@angular/core';
import { PostService } from '@core/post.service';

import { Request } from '@models/post/request.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {
  request: Request = new Request();
  edition = false;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const draft = this.postService.getRequestDraft() as Request;
    if (draft) {
      this.request = draft;
    }
    this.route.data.subscribe((data) => {
      this.request = new Request(data.request);
    });
    this.route.url.subscribe(segments => {
      const editionSegment = segments.find(segment => segment.path === 'edit');
      if (editionSegment) {
        this.edition = true;
      }
    });
  }

}
