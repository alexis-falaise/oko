import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Luggage } from '@models/luggage.model';

@Component({
  selector: 'app-trip-luggage',
  templateUrl: './trip-luggage.component.html',
  styleUrls: ['./trip-luggage.component.scss']
})
export class TripLuggageComponent implements OnInit {
  cabin: boolean;
  weight: number;
  height: number;
  width: number;
  depth: number;
  full: boolean;
  modifying: boolean;
  index: number;

  cabinDimensions = {
    height: 55,
    width: 35,
    depth: 25
  };

  cargoDimensions = {
    height: 70,
    width: 53,
    depth: 35
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {luggage: Luggage, index: number},
    private dialogRef: MatDialogRef<TripLuggageComponent>
  ) { }

  ngOnInit() {
    if (this.data) {
      this.modifying = true;
      this.cabin = this.data.luggage.cabin;
      this.weight = this.data.luggage.weight;
      this.height = this.data.luggage.height;
      this.width = this.data.luggage.width;
      this.depth = this.data.luggage.depth;
      this.full = this.data.luggage.full;
      this.index = this.data.index;
    }
    this.inCargo();
  }

  inCargo() {
    this.cabin = false;
    this.height = this.cargoDimensions.height;
    this.width = this.cargoDimensions.width;
    this.depth = this.cargoDimensions.depth;
  }

  inCabin() {
    this.cabin = true;
    this.height = this.cabinDimensions.height;
    this.width = this.cabinDimensions.width;
    this.depth = this.cabinDimensions.depth;
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close({
      luggage: new Luggage({
        height: this.height,
        width: this.width,
        depth: this.depth,
        weight: this.weight,
        cabin: this.cabin,
        full: this.full,
      }),
      index: this.index
    });
  }

}
