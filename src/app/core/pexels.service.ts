import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  getBackgroundPicture(country: string): Observable<string> {
    return Observable.create(observer => {
      const headers = new HttpHeaders({
        'Authorization': this.apiKey,
      });
      const query = `https://api.pexels.com/v1/search?query=${country}&per_page=${this.photosNumber}`;
      this.http.get(query, {headers: headers})
      .subscribe((response: any) => {
        this.photosCache[country] = response.photos;
        const number = response.photos.length;
        const random = Math.floor(Math.random() * number);
        observer.next(response.photos[random].src.medium);
        observer.complete();
      }, (error) => {
        if (this.photosCache[country]) {
          const number = this.photosCache[country].length;
          const random = Math.floor(Math.random() * number);
          const photo = this.photosCache[country][random].src.medium;
          observer.next(photo);
          observer.complete();
        }
      });
    });
  }
}