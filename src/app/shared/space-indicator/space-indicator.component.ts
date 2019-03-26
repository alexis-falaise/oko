import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

class Slot {
  filled: boolean;
  constructor(filled = false) {
    this.filled = filled;
  }
}

@Component({
  selector: 'app-space-indicator',
  templateUrl: './space-indicator.component.html',
  styleUrls: ['./space-indicator.component.scss']
})
export class SpaceIndicatorComponent implements OnInit, OnChanges {
  @Input() filling: number;
  @Input() size: number;
  @Input() light: boolean;
  @Input() absolute: boolean;
  slots: Array<Slot> = [];
  slotsNumber = 4;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filling) {
      this.filling = changes.filling.currentValue;
      this.setSlots(this.filling);
    }
    if (changes.size) {
      this.size = changes.size.currentValue;
    }
  }

  ngOnInit() {
    this.initSlots();
    if (this.filling) {
      this.setSlots(this.filling);
    }
  }

  initSlots() {
    for (let i = 0; i < this.slotsNumber; i++) {
      this.slots.push(new Slot());
    }
  }

  setSlots(filling: number) {
    this.slots = this.slots.map((slot, index) => {
      return index < filling ? new Slot(true) : new Slot(false);
    });
    console.log(this.slots);
  }

}
