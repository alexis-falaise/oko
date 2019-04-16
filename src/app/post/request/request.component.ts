import { Component, OnInit } from '@angular/core';
import { PostService } from '@core/post.service';

import { Request } from '@models/post/request.model';
import { ActivatedRoute } from '@angular/router';

import { UiService } from '@core/ui.service';
import { RequestService } from './request.service';

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
    private uiService: UiService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const draft = this.postService.getRequestDraft() as Request;
    if (draft) {
      this.request = draft;
    }
    this.uiService.setLoading(true);
    this.route.url.subscribe(segments => {
      const editionSegment = segments.find(segment => segment.path === 'edit');
      if (editionSegment) {
        this.edition = true;
        this.route.params.subscribe(params => {
          this.postService.getRequestById(params.id)
          .subscribe(request => {
            this.request = new Request(request);
            this.uiService.setLoading(false);
          });
        });
      } else {
        this.uiService.setLoading(false);
      }
    });
  }

}
