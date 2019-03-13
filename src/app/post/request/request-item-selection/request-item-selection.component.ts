import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { UserService } from '@core/user.service';
import { PostService } from '@core/post.service';
import { UiService } from '@core/ui.service';

import { Item } from '@models/item.model';
import { User } from '@models/user.model';

export class DisplayItem extends Item {
  selected: boolean;
  _id?: string;
  constructor(item: any) {
    super(item);
    if (item.id) {
      delete this.id;
    }
    if (item._id) {
      delete this._id;
    }
  }
}
@Component({
  selector: 'app-request-item-selection',
  templateUrl: './request-item-selection.component.html',
  styleUrls: ['./request-item-selection.component.scss'],
})
export class RequestItemSelectionComponent implements OnInit {
  selectableItems: Array<DisplayItem> = [];
  selectedItems: Array<Item> = [];
  loading: boolean;

  constructor(
    private userService: UserService,
    private postService: PostService,
    private uiService: UiService,
    private dialogRef: MatDialogRef<RequestItemSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
  ) { }

  ngOnInit() {
    this.uiService.onLoading().subscribe(loadingState => this.loading = loadingState);
    this.uiService.setLoading(true);
    this.userService.getCurrentUser()
    .subscribe((user) => {
      if (user) {
        this.postService.getItemByAuthor(user.id)
        .subscribe(items => {
          this.uiService.setLoading(false);
          const uniqueFilter = (value, index, self) => self.indexOf(value) === index;
          const distinctItems = items.map(item => item.label).filter(uniqueFilter);
          this.selectableItems = distinctItems.map(itemLabel => {
            return items.map(item => new DisplayItem(item)).find(item => item.label === itemLabel);
          });
        });
      } else {
        this.notConnected();
      }
    },
    (err) => this.notConnected());
  }

  notConnected() {
    this.uiService.setLoading(false);
    this.dialogRef.close();
  }

  toggleItem(item: DisplayItem) {
    const displayItemIndex = this.selectableItems.findIndex(selectableItem => selectableItem === item);
    if (item.selected) {
      this.selectableItems[displayItemIndex].selected = false;
      const itemIndex = this.selectedItems.findIndex(selectedItem => selectedItem === new Item(item));
      this.selectedItems.splice(itemIndex, 1);
    } else {
      this.selectableItems[displayItemIndex].selected = true;
      this.selectedItems.push(item);
    }
  }

  saveItems() {
    this.dialogRef.close(this.selectedItems.map(item => new Item(item)));
  }

  close() {
    this.dialogRef.close();
  }

}
