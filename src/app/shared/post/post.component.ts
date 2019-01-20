import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

import { Post } from '@models/post/post.model';
import { Trip } from '@models/post/trip.model';
import { Request } from '@models/post/request.model';
import { Location } from '@models/location.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnChanges {
  @Input() post: Post | Request | Trip;
  isTrip = false;
  isRequest = false;

  constructor() { }

  ngOnInit() {

    console.log(this.post);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.post) {
      this.post = changes.post.currentValue;
      this.isTrip = this.post instanceof Trip;
      this.isRequest = this.post instanceof Request;
    }
  }

}
