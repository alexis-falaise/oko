import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

import { Trip } from '@models/post/trip.model';

@Component({
  selector: 'app-proposal-trip',
  templateUrl: './proposal-trip.component.html',
  styleUrls: ['./proposal-trip.component.scss']
})
export class ProposalTripComponent implements OnChanges {
  @Input() trip: Trip;
  @Output() open = new EventEmitter();

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.trip) {
      this.trip = changes.trip.currentValue;
    }
  }

  openTrip() {
    this.open.emit(this.trip);
  }

}
