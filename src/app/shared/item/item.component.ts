import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Item } from '@models/item.model';
import { ItemSize, itemSizeFit } from '@static/item-sizes.static';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, OnChanges {
  @Input() item: Item;
  @Input() removable = true;
  @Input() removePanel: boolean;
  @Input() creator = false;
  @Input() fullWidth = false;
  @Input() constantHeight = false;
  @Output() remove = new EventEmitter();
  itemSize: ItemSize;

  constructor() { }

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

  removeItem() {
    this.remove.emit();
  }

}
