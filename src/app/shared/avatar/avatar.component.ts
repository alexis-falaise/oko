import { Component, OnChanges, OnInit, Input, SimpleChanges, Sanitizer } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { environment } from '@env/environment';
@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, OnChanges {

  @Input() image: string;
  @Input() size: number;
  imageUrl: SafeUrl = null;
  avatarLocation = environment.avatarLocation;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.imageUrl = this.buildUrl(this.image);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.image) {
      this.imageUrl = this.buildUrl(changes.image.currentValue);
    }
  }

  buildUrl(image: string): SafeUrl {
    let url = null;
    if (image) {
      url = this.sanitizer.bypassSecurityTrustUrl(`${this.avatarLocation}/${image}`);
    }
    return url;
  }

}
