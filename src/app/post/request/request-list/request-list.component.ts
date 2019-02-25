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
  filter = new Filter({open: true});
  filterComponentOptions = {
    country: true,
    city: true,
    beforeDate: true,
  };

  constructor(
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.postService.getRequests(this.filter);
  }

  filterRequests(filter: Filter) {
    filter.open = true;
    this.postService.getRequests(filter);
  }

  resetFilters() {
    this.postService.resetRequestFilters();
  }

}
