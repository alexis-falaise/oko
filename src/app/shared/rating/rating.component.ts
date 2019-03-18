import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

class RatingStar {
  plain: boolean;
  constructor(star: RatingStar) {
    Object.assign(this, star);
  }
}

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit, OnChanges {
  @Input() rating: number;
  @Input() light: boolean;
  @Input() size: number;
  ratingStars: Array<RatingStar> = [];
  constructor() { }

  ngOnInit() {
    this.generateRatingDisplay();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.rating) {
      if (changes.rating.currentValue === undefined || changes.rating.currentValue === null) {
        this.rating = 5;
      } else {
        this.rating = changes.rating.currentValue;
      }
      this.generateRatingDisplay();
    }
  }

  private generateRatingDisplay() {
    this.ratingStars = [];
    for (let i = 0; i < 5; i++) {
        this.ratingStars.push(new RatingStar({plain: i < this.rating}));
    }
  }

}
