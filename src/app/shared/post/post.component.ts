import { Component, OnInit, OnChanges, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import * as moment from 'moment';

import { Post } from '@models/post/post.model';
import { Trip } from '@models/post/trip.model';
import { Request } from '@models/post/request.model';

import { environment } from '@env/environment';
import { Luggage } from '@models/luggage.model';
import { Router } from '@angular/router';
import { PostService } from '@core/post.service';
import { MatSnackBar } from '@angular/material';
import { Item } from '@models/item.model';
import { ServerResponse } from '@models/app/server-response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { PexelsService } from '@core/pexels.service';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnChanges {
  @Input() post: Post | Request | Trip;
  @Input() horizontal = false;
  @Input() editable = false;
  @Output() edit = new EventEmitter();
  @Output() remove = new EventEmitter();
  weight: number;
  isTrip = true;
  isRequest = false;
  postPath = ['/post'];
  avatarLocation = environment.avatarLocation;
  panel = false;
  moment = moment;
  outdated = false;
  urgent = false;
  backgroundPicture: string;

  constructor(
    private router: Router,
    private postService: PostService,
    private snack: MatSnackBar,
    private pexels: PexelsService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.post) {
      this.buildPostProperties(changes.post.currentValue);
    }
  }

  buildPostProperties(post) {
    this.weight = null;
    this.post = post;
    this.isTrip = post instanceof Trip;
    this.isRequest = post instanceof Request;
    if (post instanceof Trip && post.luggages) {
      const luggages = post.luggages as any;
      this.weight = luggages.reduce((acc: number, luggage: Luggage) => acc + luggage.weight, 0) as number;
      this.outdated = moment(post.date).isBefore(moment.now());
    }
    if (post instanceof Request && post.items) {
      const items = post.items as any;
      this.weight = items.reduce((acc: number, item: Item) => acc + item.weight, 0) as number;
      if (post.urgent && post.urgentDetails) {
        this.outdated = moment(post.urgentDetails.date).isBefore(moment.now());
        this.urgent = true;
      }
      if (post.closed) {
        this.outdated = true;
      }
      console.log('Post', post.items);
    }
    this.postPath = [`/post/${post instanceof Trip ? 'trip' : 'request'}/${post.id}`];
    if (post instanceof Trip && this.horizontal) {
      if (post.to && post.to.airport) {
        this.pexels.getBackgroundPicture(post.to.airport.country)
        .subscribe(picture => this.backgroundPicture = picture);
      }
    }
  }

  showPanel() {
    if (this.editable) {
      this.panel = true;
    }
  }

  hidePanel() {
    this.panel = false;
  }

  editPost() {
    this.router.navigate(['post', this.isTrip ? 'trip' : 'request', this.post.id, 'edit']);
  }

  removePost() {
    const removalService = this.isTrip
    ? this.postService.removeTrip(this.post as Trip)
    : this.postService.removeRequest(this.post as Request);
    removalService.subscribe((serverResponse) => {
      if (serverResponse.status) {
        this.snack.open(`${this.isTrip ? 'Le trajet' : 'L\'annonce'} a bien été supprimé${this.isTrip ? '' : 'e'}`,
                        'OK', {duration: 3000});
        this.remove.emit();
      } else {
        const snackRef = this.snack.open('Erreur lors de la suppression', 'Réessayer', {duration: 3000});
        snackRef.onAction().subscribe(() => this.removePost());
      }
    }, (error: HttpErrorResponse) => this.serverError(error.status));
  }

  toPost() {
    if (!this.panel) {
      this.router.navigate(['post', this.isTrip ? 'trip' : 'request', this.post.id]);
    }
  }

  private serverError(status: number) {
    let message: string;
    let action: string;
    let duration: number;
    switch (status) {
      case 500:
        message = 'Une erreur a eu lieu';
        action = 'Réessayer';
        duration = 5000;
        break;
      case 404:
        message = 'Le post n\'a pas été trouvé';
        action = 'OK';
        duration = 3000;
        break;
      case 401:
        message = 'Vous n\'êtes pas connecté';
        action = 'Connexion';
        duration = 5000;
        break;
    }
    const snackRef = this.snack.open(message, action, {duration: duration});
    snackRef.onAction().subscribe(() => {
      if (status === 500) {
        this.removePost();
      }
      if (status === 401) {
        this.router.navigate(['/oneclick']);
      }
    });
  }

}
