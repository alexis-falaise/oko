import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Item } from '@models/item.model';
import { ItemSize, itemSizeFit } from '@static/item-sizes.static';
import { MatDialog } from '@angular/material';
import { ItemDetailsComponent } from '@shared/item-details/item-details.component';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, OnChanges {
  @Input() item: Item;
  @Input() openable = false;
  @Input() removable = true;
  @Input() removePanel: boolean;
  @Input() creator = false;
  @Input() fullWidth = false;
  @Input() constantHeight = false;
  @Output() remove = new EventEmitter();
  itemSize: ItemSize;

  constructor(private dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.item) {
      this.item  = changes.item.currentValue;
      this.itemSize = itemSizeFit(this.item);
    }
    if (changes.removePanel) {
      this.removePanel = changes.removePanel.currentValue;
    }
  }

  ngOnInit() {
  }

  openItem() {
    if (this.openable) {
      this.dialog.open(ItemDetailsComponent, {
        data: this.item,
        height: '75vh',
        width: '80vw',
      });
    }
  }

  removeItem() {
    this.remove.emit();
  }

}
