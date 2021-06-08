import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Observer, of } from 'rxjs';

import { environment } from '@env/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PexelsService {
  apiKey = '563492ad6f917000010000011f73b6d4b18f4d21a990fe3bdcec16b5';
  pixabayApiKey = '554684-c31903762eb8065c0dd2ce661';
  photosNumber = 50;
  photosCache = {};
  serverUrl = environment.serverUrl;
  constructor(
    private http: HttpClient,
  ) { }

  getBackgroundPicture(country: string,
  size: 'original' | 'large' | 'large2x' | 'medium' | 'small' | 'portrait' | 'landscape' | 'tiny' = 'large',
  pixabay: boolean = false): Observable<string> {
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
            this.savePictureSet(response.photos, country);
            const photo = this.getPictureFromArray(response.photos, size, false);
            this.loadImage(observer, photo);
          } else {
            this.getPictureFromServer(observer, country, size);
          }
        }
      }, (error) => {
        this.getPictureFromServer(observer, country, size);
      });
    });
  }

  private getPictureFromServer(observer, country, size) {
    this.http.get(`${this.serverUrl}/app/picture?location=${country}`)
    .subscribe((serverResponse: Array<any>) => {
        const photo = this.getPictureFromServerArray(serverResponse, size);
        this.loadImage(observer, photo);
    }, (error) => this.getCachedBackgroundPicture(observer, country, size));
  }

  private savePictureSet(set: Array<any>, query: string) {
    const savedSet = set.map(photoRef => {
      return {
        id: photoRef.id,
        photographer: photoRef.photographer,
        width: photoRef.width,
        height: photoRef.height,
        query: query,
        original: photoRef.src['original'],
        large: photoRef.src['large'],
        large2x: photoRef.src['large2x'],
        medium: photoRef.src['medium'],
        small: photoRef.src['small'],
        portrait: photoRef.src['portrait'],
        landscape: photoRef.src['landscape'],
        tiny: photoRef.src['tiny'],
      };
    });
    this.http.post(`${this.serverUrl}/app/picture`, savedSet)
      .pipe(catchError((err, caught) => of(caught)))
      .subscribe(
        (response) => {},
        (error) => console.error(error)
      );
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

  private getPictureFromServerArray(array: Array<any>, size: string) {
    const number = array.length;
    const random = Math.floor(Math.random() * number);
    const picture = array[random];
    return picture[size];
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
