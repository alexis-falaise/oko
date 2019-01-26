import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@env/environment';
import { ServerResponse } from '@models/app/server-response.model';
import { Airport } from '@models/airport.model';

@Injectable({
  providedIn: 'root'
})
export class GeoService {
  private airportUrl = `${environment.serverUrl}/airport`;

  airports = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
  ) { }

  onAirports() {
    return this.airports.asObservable();
  }

  getAirports(code?: string, name?: string, city?: string, country?: string) {
    this.http.get(`${this.airportUrl}?code=${code || ''}&name=${name || ''}&city=${city || ''}&country=${country || ''}`, {
      withCredentials: true
    }).subscribe((response: ServerResponse) => {
      if (response.status) {
        this.airports.next(response.data);
      }
    });
  }

  getAirportById(id: number): Observable<Airport> {
    return this.http.get(`${this.airportUrl}/${id}`) as Observable<Airport>;
  }
}
