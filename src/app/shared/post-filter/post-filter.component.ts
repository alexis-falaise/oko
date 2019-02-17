import { Component, EventEmitter, OnInit, OnChanges, Input, Output, SimpleChanges } from '@angular/core';
import { Filter } from '@models/app/filter.model';
import { DateAdapter } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-post-filter',
  templateUrl: './post-filter.component.html',
  styleUrls: ['./post-filter.component.scss']
})
export class PostFilterComponent implements OnInit, OnChanges {
  @Input() filter = new Filter();
  @Output() filterRefresh = new EventEmitter();
  @Output() resetFilter = new EventEmitter();
  today = moment();

  constructor(private dateAdapter: DateAdapter<Date>) { }

  ngOnChanges(change: SimpleChanges) {
    if (change.filter) {
      this.filter = change.filter.currentValue;
    }
  }

  ngOnInit() {
    this.dateAdapter.setLocale('fr');
  }

  emitFilter() {
    this.filterRefresh.emit(this.filter);
  }

  reset() {
    this.resetFilter.emit();
  }

}
