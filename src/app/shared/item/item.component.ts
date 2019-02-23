import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Item } from '@models/item.model';

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
  @Output() remove = new EventEmitter();

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.item) {
      this.item  = changes.item.currentValue;
      console.log(this.item);
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
