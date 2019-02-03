import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-trip-sizing',
  templateUrl: './trip-sizing.component.html',
  styleUrls: ['./trip-sizing.component.scss']
})
export class TripSizingComponent implements OnInit {
  @Output() complete = new EventEmitter();
  sizing = this.fb.group({
    weight: [null, Validators.min(0)],
    height: [null, Validators.min(0)],
    width: [null, Validators.min(0)],
    depth: [null, Validators.min(0)],
    cabin: [false],
    full: [false]
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  submit() {
    this.complete.emit(this.sizing.value);
  }

}
