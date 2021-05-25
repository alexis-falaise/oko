import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from '@models/item.model';
import { ItemSize, itemSizeFit } from '@static/item-sizes.static';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {
  item: Item;
  itemSize: ItemSize;
  title: string;
  subtitle: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Item,
    private dialog: MatDialogRef<ItemDetailsComponent>,
  ) { }

  ngOnInit() {
    this.item = this.data;
    this.formatLabel();
    this.itemSize = itemSizeFit(this.item);
  }

  formatLabel() {
    if (this.item && this.item.label) {
      const label = this.item.label;
      const labelWords = label.split(' ');
      this.title = labelWords.slice(0, 2).join(' ');
      this.subtitle = labelWords.slice(2).join(' ');
    }
  }

  close() {
    this.dialog.close();
  }

}
