import { Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-trip-constraints',
  templateUrl: './trip-constraints.component.html',
  styleUrls: ['./trip-constraints.component.scss']
})
export class TripConstraintsComponent implements OnInit, OnChanges {

  @Input() constraintsInfo;
  @Output() valid = new EventEmitter();
  constraints = this.fb.group({
    height: ['', Validators.min(0)],
    width: ['', Validators.min(0)],
    depth: ['', Validators.min(0)],
    weight: ['', Validators.min(0)],
    airportDrop: this.fb.control(false),
    cabinOnly: this.fb.control(false)
  });

  constructor(private fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.constraintsInfo && changes.constraintsInfo.currentValue) {
      this.constraints.patchValue(changes.constraintsInfo.currentValue);
    }
  }

  ngOnInit() {
    this.constraints.statusChanges
    .subscribe(status => {
      if (status === 'VALID') {
        this.valid.emit(this.constraints.value);
      }
    });
  }

}
