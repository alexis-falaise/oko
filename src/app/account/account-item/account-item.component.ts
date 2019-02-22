import { Component, OnInit } from '@angular/core';

import { PostService } from '@core/post.service';
import { UserService } from '@core/user.service';

import { Item } from '@models/item.model';

@Component({
  selector: 'app-account-item',
  templateUrl: './account-item.component.html',
  styleUrls: ['./account-item.component.scss']
})
export class AccountItemComponent implements OnInit {
  items: Array<Item>;

  constructor(
    private postService: PostService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.postService.getItemByAuthor(user.id)
        .subscribe(items => {
          this.items = items;
        });
      }
    });
  }

}
