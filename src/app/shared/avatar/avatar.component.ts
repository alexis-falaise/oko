import { Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, OnChanges {

  @Input() image: string;
  imageUrl: string = null;
  avatarLocation = 'assets/avatar';

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
    console.log('build avatar url', image);
    return `url(${this.avatarLocation}/${image})`;
  }

}
