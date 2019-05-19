import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { timer } from 'rxjs';
import { fillingDescriptions } from '@static/luggage-filling.static';

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
  slotsNumber = 4;
  filled: boolean;
  fillingDescriptions = fillingDescriptions;
  fillingRate = 0;
  descriptionDisplay = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filling) {
      this.filling = changes.filling.currentValue;
    }
    if (changes.size) {
      this.size = changes.size.currentValue;
      console.log(this.size);
    }
  }

  ngOnInit() {
      timer(250).subscribe(() => {
        this.filled = true;
        this.fillingRate = this.filling / this.slotsNumber * 100;
      });
  }

}
