import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Filter } from '@models/app/filter.model';
import { DateAdapter } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-post-filter',
  templateUrl: './post-filter.component.html',
  styleUrls: ['./post-filter.component.scss']
})
export class PostFilterComponent implements OnInit {
  @Output() filterRefresh = new EventEmitter();
  filter = new Filter();
  today = moment();

  constructor(private dateAdapter: DateAdapter<Date>) { }

  ngOnInit() {
    this.dateAdapter.setLocale('fr');
  }

  emitFilter() {
    this.filterRefresh.emit(this.filter);
  }

}
