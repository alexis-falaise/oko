import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';

@Component({
  selector: 'app-trip-location',
  templateUrl: './trip-location.component.html',
  styleUrls: ['./trip-location.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class TripLocationComponent implements OnInit, OnChanges {

  @Output() valid = new EventEmitter();
  @Input() city = null;
  @Input() date = null;
  @Input() time = null;
  @Input() minDate = null;
  today = moment();
  location = this.fb.group({
    city: ['', Validators.required],
    date: [this.minDate || this.today, Validators.required],
    time: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private adapter: DateAdapter<any>,
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
    if (changes.minDate) {
      const minDate = changes.minDate.currentValue;
      this.location.controls.date.patchValue(minDate);
    }
  }

  ngOnInit() {
    this.adapter.setLocale('fr');
    this.location.statusChanges
    .subscribe(status => {
      if (status === 'VALID') {
        this.valid.emit(this.location.value);
      }
    });
  }

}
