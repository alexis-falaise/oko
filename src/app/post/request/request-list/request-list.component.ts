import { Component, OnInit } from '@angular/core';
import { PostService } from '@core/post.service';
import { Request } from '@models/post/request.model';
import { Filter } from '@models/app/filter.model';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {

  requests: Array<Request> = null;

  constructor(
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.postService.getRequests(new Filter({open: true}));
  }

}
