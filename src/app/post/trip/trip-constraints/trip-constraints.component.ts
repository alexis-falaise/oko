import { Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Luggage } from '@models/luggage.model';
import { TripLuggageComponent } from '../trip-luggage/trip-luggage.component';

@Component({
  selector: 'app-trip-constraints',
  templateUrl: './trip-constraints.component.html',
  styleUrls: ['./trip-constraints.component.scss']
})
export class TripConstraintsComponent implements OnInit, OnChanges {

  @Input() constraintsInfo;
  @Output() complete = new EventEmitter();
  luggages: Array<Luggage> = [];
  airportDrop = true;
  bonus = 0;

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.constraintsInfo) {
      const constraints = changes.constraintsInfo.currentValue;
      if (constraints) {
        this.luggages = constraints.luggages;
        this.airportDrop = constraints.airportDrop;
      }
    }
  }

  ngOnInit() {}

  openLuggageDialog(luggage?: Luggage, index?: number) {
    const dialogRef = this.dialog.open(TripLuggageComponent, {
      width: '98vw',
      height: '95vh',
      data: luggage ? {luggage: luggage, index: index} : null
    });
    dialogRef.afterClosed().subscribe(savingData => {
      if (savingData) {
        if (savingData.index) {
          this.luggages[savingData.index] = savingData.luggage;
        } else {
          this.addLuggage(savingData.luggage);
        }
      }
    });
  }

  addLuggage(luggage?) {
    this.luggages.push(luggage ? luggage : new Luggage());
    this.emit();
  }

  editLuggage(index) {
    const luggage = this.luggages[index];
    this.openLuggageDialog(luggage, index);
  }

  removeLuggage(index) {
    this.luggages.splice(index, 1);
    this.emit();
  }

  inAirport() {
    this.airportDrop = true;
    this.emit();
  }

  inLocation() {
    this.airportDrop = false;
    this.emit();
  }

  emit() {
    const constraints = {
      luggages: this.luggages,
      airportDrop: this.airportDrop,
      bonus: this.bonus,
    };
    this.complete.emit(constraints);
  }

}
