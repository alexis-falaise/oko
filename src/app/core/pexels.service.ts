import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Observer, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PexelsService {
  apiKey = '563492ad6f917000010000011f73b6d4b18f4d21a990fe3bdcec16b5';
  photosNumber = 10;
  photosCache = {};
  constructor(
    private http: HttpClient,
  ) { }

  getBackgroundPicture(country: string, size: string = 'large'): Observable<string> {
    return Observable.create(observer => {
      const headers = new HttpHeaders({
        'Authorization': this.apiKey,
      });
      const query = `https://api.pexels.com/v1/search?query=${country}&per_page=${this.photosNumber}`;
      this.http.get(query, {headers: headers})
      .subscribe((response: any) => {
        if (response.photos) {
          const photo = this.getPictureFromPexelsArray(response.photos, size);
          this.loadImage(observer, photo);
        } else {
          this.getCachedBackgroundPicture(observer, country, size);
        }
      }, (error) => {
        this.getCachedBackgroundPicture(observer, country, size);
      });
    });
  }

  private getCachedBackgroundPicture(observer: Observer<string>, country: string, size: string) {
    if (this.photosCache[country]) {
      const photo = this.getPictureFromPexelsArray(this.photosCache[country], size);
      this.loadImage(observer, photo);
    } else {
      observer.next(null);
      observer.complete();
    }
  }

  private getPictureFromPexelsArray(array: Array<any>, size: string) {
    const number = array.length;
    const random = Math.floor(Math.random() * number);
    if (array[random]) {
      return array[random].src[size];
    } else {
      return null;
    }
  }

  private loadImage(observer: Observer<string>, photo: string) {
    const image = new Image();
    image.onload = () => {
      observer.next(photo);
      observer.complete();
    };
    image.src = photo;
  }
}
