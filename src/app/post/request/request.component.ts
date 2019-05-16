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
  draft = false;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.url.subscribe(segments => {
      const editionSegment = segments.find(segment => segment.path === 'edit');
      if (editionSegment) {
        console.log('Request component - edition');
        this.edition = true;
      } else {
        const draft = this.postService.getRequestDraft() as Request;
        if (draft) {
          this.request = draft;
          this.draft = true;
        }
      }
    });
    this.route.data.subscribe((data) => {
      console.log('Request component - set request');
      this.request = new Request(data.request);
    });
  }

  removeDraft() {
    this.postService.deleteRequestDraft();
  }

}
