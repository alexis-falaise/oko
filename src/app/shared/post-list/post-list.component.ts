import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Post } from '@models/post/post.model';

import { PostService } from '@core/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Array<Post>;
  @Output() listRefresh = new EventEmitter();

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.postService.onPosts()
    .subscribe(posts => {
      this.posts = posts;
      this.listRefresh.emit(posts.length);
    });
  }

}
