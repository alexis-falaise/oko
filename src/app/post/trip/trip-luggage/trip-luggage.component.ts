import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Luggage } from '@models/luggage.model';

@Component({
  selector: 'app-trip-luggage',
  templateUrl: './trip-luggage.component.html',
  styleUrls: ['./trip-luggage.component.scss']
})
export class TripLuggageComponent implements OnInit {
  @ViewChild('stepper') public stepper;
  cabin: boolean;
  weight: number;
  height: number;
  width: number;
  depth: number;
  full: boolean;
  large = false;
  modifying: boolean;
  error: boolean;
  index: number;
  freeSpace = 1;

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

  largeDimensions = {
    height: 100,
    width: 100,
    depth: 100,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {luggage: Luggage, index: number},
    private dialogRef: MatDialogRef<TripLuggageComponent>
  ) { }

  ngOnInit() {
    this.inCargo();
    if (this.data) {
      this.setLuggageData();
    }
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

  isLarge() {
    this.large = true;
    this.height = this.largeDimensions.height;
    this.width = this.largeDimensions.width;
    this.depth = this.largeDimensions.depth;
  }

  close() {
    this.dialogRef.close();
  }

  next() {
    this.stepper.next();
  }

  previous() {
    this.stepper.previous();
  }

  save() {
    if (this.weight) {
      // this.calculateDimensions();
      this.dialogRef.close({
        luggage: new Luggage({
          height: this.height,
          width: this.width,
          depth: this.depth,
          weight: this.weight,
          cabin: this.cabin,
          large: this.large,
          full: this.full,
          availableSpace: this.freeSpace,
        }),
        index: this.index,
        modifying: this.modifying,
      });
    } else {
      this.error = true;
    }
  }

  private setLuggageData() {
    this.modifying = true;
    const referentialHeight = this.large
    ? this.largeDimensions.height : this.cabin
    ? this.cabinDimensions.height : this.cargoDimensions.height;
    this.large = this.data.luggage.large;
    this.cabin = this.data.luggage.cabin;
    this.weight = this.data.luggage.weight;
    this.height = this.data.luggage.height;
    this.width = this.data.luggage.width;
    this.depth = this.data.luggage.depth;
    this.freeSpace = this.data.luggage.availableSpace || Math.ceil(this.height / referentialHeight * 4);
    this.full = this.data.luggage.full;
    this.index = this.data.index;
  }

  private calculateDimensions() {
    const dimensions = this.large
    ? this.largeDimensions : this.cabin
    ? this.cabinDimensions : this.cargoDimensions;
    this.height = this.large ? dimensions.height : dimensions.height * (this.freeSpace / 4);
    this.width = this.large ? dimensions.width : dimensions.width * (this.freeSpace / 4);
    this.depth = this.large ? dimensions.depth : dimensions.depth * (this.freeSpace / 4);
  }

}
