import { Component, EventEmitter, OnInit, OnChanges, Input, Output, SimpleChanges } from '@angular/core';
import { Filter } from '@models/app/filter.model';
import { DateAdapter } from '@angular/material';
import * as moment from 'moment';

class FilterOptions {
  location: boolean;
  city: boolean;
  country: boolean;
  beforeDate: boolean;
  constructor(options: Partial<FilterOptions>) {
    Object.assign(this, options);
  }
}
@Component({
  selector: 'app-post-filter',
  templateUrl: './post-filter.component.html',
  styleUrls: ['./post-filter.component.scss']
})
export class PostFilterComponent implements OnInit, OnChanges {
  @Input() filter = new Filter();
  @Input() options = new FilterOptions({location: true});
  @Output() filterRefresh = new EventEmitter();
  @Output() resetFilter = new EventEmitter();
  today = moment();

  constructor(private dateAdapter: DateAdapter<Date>) { }

  ngOnChanges(change: SimpleChanges) {
    if (change.filter) {
      this.filter = change.filter.currentValue;
    }
    if (change.options) {
      this.options = new FilterOptions(change.options.currentValue);
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
