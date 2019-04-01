import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Observer, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PexelsService {
  apiKey = '563492ad6f917000010000011f73b6d4b18f4d21a990fe3bdcec16b5';
  pixabayApiKey = '554684-c31903762eb8065c0dd2ce661';
  photosNumber = 10;
  photosCache = {};
  constructor(
    private http: HttpClient,
  ) { }

  getBackgroundPicture(country: string, size: string = 'large', pixabay: boolean = false): Observable<string> {
    return Observable.create(observer => {
      const headers = new HttpHeaders({
        'Authorization': this.apiKey,
      });

      const query = `https://api.pexels.com/v1/search?query=${country}&per_page=${this.photosNumber}`;

      const pixabayQuery = `http://pixabay.com/api/?key=${this.pixabayApiKey}&q=${country}
      &image_type=photo&orientation=horizontal&category=travel`;

      const request = pixabay ? this.http.get(pixabayQuery) : this.http.get(query, {headers: headers});

      request.subscribe((response: any) => {
        if (pixabay) {
          if (response.hits) {
            const photo = this.getPictureFromArray(response.hits, size, true);
            this.loadImage(observer, photo);
          }
        } else {
          if (response.photos) {
            this.photosCache[country] = response.photos;
            const photo = this.getPictureFromArray(response.photos, size, false);
            this.loadImage(observer, photo);
          } else {
            this.getCachedBackgroundPicture(observer, country, size);
          }
        }
      }, (error) => {
        this.getCachedBackgroundPicture(observer, country, size);
      });
    });
  }

  private getCachedBackgroundPicture(observer: Observer<string>, country: string, size: string) {
    if (this.photosCache[country]) {
      const photo = this.getPictureFromArray(this.photosCache[country], size, false);
      this.loadImage(observer, photo);
    } else {
      observer.next(null);
      observer.complete();
    }
  }

  private getPictureFromArray(array: Array<any>, size: string, pixabay: boolean) {
    const number = array.length;
    const random = Math.floor(Math.random() * number);
    const item = array[random];
    if (item) {
      return pixabay ? item.webformatURL : item.src[size];
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
