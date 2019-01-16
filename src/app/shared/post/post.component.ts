import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

import { Post } from '@models/post/post.model';
import { Trip } from '@models/post/trip.model';
import { Request } from '@models/post/request.model';
import { Location } from '@models/location.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: Post | Request | Trip;

  constructor() { }

  ngOnInit() {
    this.post = new Trip({
      user: {
        firstname: 'Alex',
        lastname: 'Andre',
        email: 'alex@andre.com',
        password: 'alexandre',
      },
      submitDate: moment(),
      from: {
        label: 'Paris',
        airport: {
          label: 'Paris CDG',
          name: 'Aéroport Paris Charles de Gaulle',
          code: 'CDG',
        },
        timezone: 1,
      },
      to: {
        label: 'Santa Cruz',
        airport: {
          label: 'Santa Cruz Viru Viru',
          name: 'Viru Viru',
          code: 'VIR',
        },
        timezone: -4,
      },
      date: moment().set({year: 2019, month: 0, day: 20}),
      airportDrop: true,
      cabinOnly: true,
    });

    console.log(this.post);


  }

}
