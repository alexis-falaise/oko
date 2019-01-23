import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as moment from 'moment';

import { Filter } from '@models/app/filter.model';
import { Post } from '@models/post/post.model';
import { Trip } from '@models/post/trip.model';
import { Request } from '@models/post/request.model';
import { Id } from '@models/id.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postData = [new Trip({
    user: {
      firstname: 'Alex',
      lastname: 'Andre',
      email: 'alex@andre.com',
      password: 'alexandre',
      avatar: 'user-alex.png',
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
    id: 1,
  }),
  new Trip({
    user: {
      firstname: 'Benjamin',
      lastname: 'Min',
      email: 'benja@min.com',
      password: 'alexandre',
    },
    submitDate: moment(),
    from: {
      label: 'Dakar',
      airport: {
        label: 'Dakar Sédar-Senghor',
        name: 'Aéroport International Leopold-Sédar-Senghor',
        code: 'DKR',
      },
      timezone: -1,
    },
    to: {
      label: 'Abidjan',
      airport: {
        label: 'Abidjan Houphouët Boigny',
        name: 'Aéroport Felix Houphouët Boigny',
        code: 'ABJ',
      },
      timezone: 0,
    },
    date: moment().set({year: 2019, month: 1, day: 3}),
    airportDrop: true,
    cabinOnly: false,
    id: 2,
  }),
  new Trip({
    user: {
      firstname: 'Melanie',
      lastname: 'Flex',
      email: 'melanie@flex.com',
      password: 'alexandre',
    },
    submitDate: moment(),
    from: {
      label: 'Marseille',
      airport: {
        label: 'Marseille Provence',
        name: 'Aéroport Marseille Provence',
        code: 'MRS',
      },
      timezone: -1,
    },
    to: {
      label: 'Mumbai',
      airport: {
        label: 'Mumbai Chhatrapati Shivaji',
        name: 'Aéroport international Chhatrapati Shivaji',
        code: 'BOM',
      },
      timezone: 0,
    },
    date: moment().set({year: 2019, month: 1, day: 3}),
    airportDrop: true,
    cabinOnly: true,
    id: 3,
  })
  ];
  posts = new BehaviorSubject<Array<Post>>(null);
  postDraft: Post = null;

  constructor() {
    this.posts.next(this.postData);
  }

  onPosts(): Observable<Array<Post>> {
    return this.posts.asObservable();
  }

  filterPosts(filter: Filter) {
    const posts = this.postData;
    const filterLocation = filter.location ? filter.location.toUpperCase() : null;
    const filterItem = filter.item ? filter.item.toUpperCase() : null;

    const filteredPosts = posts.filter(post => {
      let validPost = false;
      if (post instanceof Trip) {
        if (post.to.label.toUpperCase().includes(filterLocation)
            || post.to.airport.label.toUpperCase().includes(filterLocation)
            || post.to.airport.name.toUpperCase().includes(filterLocation)
            || post.to.airport.code.toUpperCase().includes(filterLocation)
        ) {
          validPost = true;
        }
      }
      return validPost;
    });
    this.posts.next(filteredPosts);
  }

  resetPosts() {
    this.posts.next(this.postData);
  }

  draftPost(filter: Filter) {
    this.postDraft = new Request({
      items: [{label : filter.item}],
      location: {label: filter.location}}
    );
  }

  getCurrentDraft(): Post {
    return this.postDraft;
  }

  getPostById(id: number): Post {
    const post = this.postData.find(searchedPost => {
      return searchedPost.id === id;
    });
    console.log('Get post by Id', post);
    return post;
  }

}
