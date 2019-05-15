import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@env/environment';
import { ServerResponse } from '@models/app/server-response.model';
import { Airport } from '@models/airport.model';

const placesApiUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${environment.placesApiKey}`;
const airportApiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?types=airport&key=${environment.placesApiKey}`;

@Injectable({
  providedIn: 'root'
})
export class GeoService {
  private airportUrl = `${environment.serverUrl}/airport`;
  private placesUrl = `${placesApiUrl}&inputtype=textquery&input=`;
  private airportMapsUrl = `${airportApiUrl}&radius=150000&input=`;

  airports = new BehaviorSubject([]);
  cities = new BehaviorSubject([]);

  constructor(
    private http: HttpClient,
  ) { }

  onAirports() {
    return this.airports.asObservable();
  }

  onCities() {
    return this.cities.asObservable();
  }

  getAirports(code?: string, name?: string, city?: string, country?: string) {
    this.http.get(`${this.airportUrl}?code=${code || ''}&name=${name || ''}&city=${city || ''}&country=${country || ''}`, {
      withCredentials: true
    }).subscribe((response: ServerResponse) => {
      if (response.status) {
        this.airports.next(response.data);
      }
    }, (error: HttpErrorResponse) => {
      this.airports.next([]);
    });
  }

  getAirportById(id: number): Observable<Airport> {
    return this.http.get(`${this.airportUrl}/${id}`) as Observable<Airport>;
  }

  getCities(city?: string) {
    this.http.get(`${this.airportUrl}/city/${city}` )
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.cities.next(response.data);
      } else {
        this.cities.next([]);
      }
    }, (error: HttpErrorResponse) => {
      this.cities.next([]);
    });
  }

  searchCity(city: string) {
    this.http.get(`${this.placesUrl}${city}`).subscribe((response) => {
      console.log('GCP Maps res', response);
    });
  }

  resetAirports() {
    this.airports.next([]);
  }

  resetCities() {
    this.cities.next([]);
  }
}
