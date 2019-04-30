import { Component, EventEmitter, OnInit, OnChanges, Input, Output, SimpleChanges } from '@angular/core';
import { DateAdapter } from '@angular/material';
import { timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import { Filter } from '@models/app/filter.model';

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
  isFilled = false;
  nextQuery = new Subject();
  today = moment();

  constructor(private dateAdapter: DateAdapter<Date>) { }

  ngOnChanges(change: SimpleChanges) {
    if (change.filter) {
      this.filter = change.filter.currentValue;
      this.checkFilter();
    }
    if (change.options) {
      this.options = new FilterOptions(change.options.currentValue);
    }
  }

  ngOnInit() {
    this.dateAdapter.setLocale('fr');
  }

  emitFilter() {
    this.nextQuery.next();
    this.checkFilter();
    timer(250).pipe(takeUntil(this.nextQuery))
    .subscribe(() => this.filterRefresh.emit(this.filter));
  }

  checkFilter() {
    this.isFilled = false;
    Object.keys(this.filter).forEach(filterLabel => {
      if (this.filter[filterLabel] && this.filter[filterLabel] !== '' && filterLabel !== 'open') {
        this.isFilled = true;
      }
    });
  }

  reset() {
    this.isFilled = false;
    this.resetFilter.emit();
  }

}
