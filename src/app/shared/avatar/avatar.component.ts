import { Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';

import { environment } from '@env/environment';
@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, OnChanges {

  @Input() image: string;
  @Input() size: number;
  imageUrl: string = null;
  avatarLocation = environment.avatarLocation;

  constructor() { }

  ngOnInit() {
    this.buildUrl(this.image);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.image) {
      this.imageUrl = this.buildUrl(changes.image.currentValue);
    }
  }

  buildUrl(image: string) {
    return `url('${this.avatarLocation}/${image}')`;
  }

}
