import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';

import { GeoService } from '@core/geo.service';
import { Airport } from '@models/airport.model';
import { Observable } from 'rxjs';
import { isString } from 'util';

@Component({
  selector: 'app-trip-location',
  templateUrl: './trip-location.component.html',
  styleUrls: ['./trip-location.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class TripLocationComponent implements OnInit, OnChanges {

  @Output() valid = new EventEmitter();
  @Input() city = null;
  @Input() date = null;
  @Input() time = null;
  @Input() airport = null;
  @Input() cityReadonly = false;
  @Input() dateReadonly = false;
  @Input() timeReadonly = false;
  @Input() minDate = null;
  @Input() edition = false;
  airports = [];
  cities: Array<string> = [];
  filteredAirports: Array<Airport>;
  today = moment();
  cityFocus = false;
  location = this.fb.group({
    city: ['', Validators.required],
    date: [this.minDate || this.today, Validators.required],
    airport: new FormControl({value: null, disabled: !this.airports.length}, Validators.required),
    time: ['', Validators.compose([Validators.required, Validators.maxLength(5), Validators.minLength(0)])]
  });
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private adapter: DateAdapter<any>,
    private ref: ChangeDetectorRef,
    private geoService: GeoService,
    ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.city) {
      const city = changes.city.currentValue;
      this.location.controls.city.patchValue(city);
    }
    if (changes.date) {
      const date = changes.date.currentValue;
      this.location.controls.date.patchValue(date);
    }
    if (changes.time) {
      const time = changes.time.currentValue;
      this.location.controls.time.patchValue(time);
    }
    if (changes.airport) {
      const airport = changes.airport.currentValue;
      this.location.controls.airport.patchValue(airport);
    }
    if (changes.minDate) {
      const minDate = changes.minDate.currentValue;
      this.location.controls.date.patchValue(minDate);
    }
  }

  ngOnInit() {
    this.adapter.setLocale('fr');
    this.geoService.onAirports()
    .subscribe(airports => {
      if (airports) {
        this.setAirportList(airports);
        this.location.controls.airport.enable();
      } else {
        this.airports = null;
      }
    });

    this.geoService.onCities()
    .subscribe(cities => {
      if (cities) {
        this.cities = cities;
        this.ref.detectChanges();
      } else {
        this.cities = null;
      }
    });

    this.location.controls.time.valueChanges
    .subscribe((value: string) => {
      this.validateTime(value);
    });

    this.location.controls.city.statusChanges
    .subscribe(status => {
      if (status === 'VALID') {
        this.fetchMatchingAirports(this.location.controls.city.value);
      }
    });

    this.location.controls.airport.valueChanges
    .subscribe(value => this.filteredAirports = this.filterAirports(value));

    this.location.valueChanges.subscribe(() => this.submitted = false);

    if (this.edition) {
      this.location.statusChanges.subscribe(status => {
        if (status === 'VALID') {
          this.submit();
        }
      });
    }
  }

  submit() {
    if (this.location.valid) {
      this.valid.emit(this.location.value);
    }
    this.submitted = true;
  }

  setAirportList(airports: Array<Airport>) {
    this.airports = airports;
    this.filteredAirports = airports;
  }

  displayAirport(airport: Airport) {
    return airport ? `${airport.name} (${airport.code}) - ${airport.country}` : null;
  }

  fetchMatchingAirports(city: string) {
    this.setAirportList(null);
    this.geoService.getAirports(undefined, undefined, city);
  }

  fetchCities(city: string) {
    this.geoService.getCities(city);
  }

  private filterAirports(value: string): Array<Airport> {
    const filterValue = value && isString(value) ? value.toLowerCase() : '';
    return this.airports ? this.airports
    .filter(airport => airport.name.toLowerCase().includes(filterValue))
    : null;
  }

  private validateTime(value: string) {
    let hours = null;
    let minutes = null;
    if (value.length === 2 && !value.includes(':')) {
      hours = parseInt(value, 10);
      if (hours < 24 && hours >= 0) {
        const time = `${hours}:`;
        this.location.controls.time.patchValue(time);
      } else {
        this.location.controls.time.setErrors({invalid : true});
      }
    }
    if (value.length > 2 && value.length <= 5) {
      if (value.charAt(2) === ':' || value.charAt(1) === ':') {
        hours = parseInt(value.slice(0, 2), 10);
        minutes = parseInt(value.slice(3), 10);
        if (!(hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60)) {
          this.location.controls.time.setErrors({invalid : true });
        }
      } else {
        this.location.controls.time.setErrors({invalid : true });
      }
    } else {
      this.location.controls.time.setErrors({invalid : true});
    }
  }

}
