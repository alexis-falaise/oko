import { Component, OnInit, OnChanges, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';

import { Post } from '@models/post/post.model';
import { Trip } from '@models/post/trip.model';
import { Request } from '@models/post/request.model';

import { environment } from '@env/environment';
import { Luggage } from '@models/luggage.model';
import { Router } from '@angular/router';
import { PostService } from '@core/post.service';
import { MatSnackBar } from '@angular/material';
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
  isTrip = false;
  isRequest = false;
  postPath = ['/post'];
  avatarLocation = environment.avatarLocation;
  panel = false;

  constructor(
    private router: Router,
    private postService: PostService,
    private snack: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.post) {
      this.buildPostProperties(changes.post.currentValue);
    }
  }

  buildPostProperties(post) {
    this.post = post;
    this.isTrip = post instanceof Trip;
    this.isRequest = post instanceof Request;
    if (this.isRequest) {
      console.log('Request', post);
    }
    if (post instanceof Trip && post.luggages) {
      const luggages = post.luggages as any;
      this.weight = luggages.reduce((acc: number, luggage: Luggage) => acc + luggage.weight, 0) as number;
    }
    this.postPath = [`/post/${post instanceof Trip ? 'trip' : 'request'}/${post.id}`];
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
        this.snack.open(`${this.isTrip ? 'Le trajet' : 'La demande'} a bien été supprimé ${this.isTrip ? '' : 'e'}`,
                        'OK', {duration: 3000});
        this.remove.emit();
      } else {
        const snackRef = this.snack.open('Erreur lors de la suppression', 'Réessayer', {duration: 3000});
        snackRef.onAction().subscribe(() => this.removePost());
      }
    });
  }

  toPost() {
    if (!this.panel) {
      this.router.navigate(['post', this.isTrip ? 'trip' : 'request', this.post.id]);
    }
  }

}
