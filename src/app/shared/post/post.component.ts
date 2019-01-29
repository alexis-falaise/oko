import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

import { Post } from '@models/post/post.model';
import { Trip } from '@models/post/trip.model';
import { Request } from '@models/post/request.model';
import { Location } from '@models/location.model';

import { environment } from '@env/environment';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnChanges {
  @Input() post: Post | Request | Trip;
  @Input() horizontal = false;
  isTrip = false;
  isRequest = false;
  postPath = ['/post'];
  avatarLocation = environment.avatarLocation;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.post) {
      this.buildPostProperties(changes.post.currentValue);
    }
  }

  buildPostProperties(post) {
    this.post = post;
    this.isTrip = post instanceof Trip;
    this.isRequest = post instanceof Request;
    this.postPath = [`/post/${post instanceof Trip ? 'trip' : 'request'}/${post.id}`];
  }

}
