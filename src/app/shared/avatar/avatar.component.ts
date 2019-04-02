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
  @Input() shadowed: boolean;
  @Input() connected: boolean;
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
    let untrustedUrl = null;
    if (image) {
      untrustedUrl = `${this.avatarLocation}/${image}`;
      if (image.includes('graph.facebook.com')) {
        untrustedUrl = image;
      }
      url = this.sanitizer.bypassSecurityTrustUrl(untrustedUrl);
    }
    return url;
  }

}
