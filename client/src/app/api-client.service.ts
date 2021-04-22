import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import Country from './country.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  constructor(private http: HttpClient) {}

  baseURL = 'https://ghoapi.azureedge.net';

  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': this.baseURL,
    }),
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  getCountries(): Observable<Country[]> {
    //console.log(`url`, `${this.baseURL}/api/DIMENSION/COUNTRY/DimensionValues`);
    return this.http
      .get<Country[]>(
        `${this.baseURL}/api/DIMENSION/COUNTRY/DimensionValues`,
        this.httpOptions
      )
      .pipe(
        // tap((_) => console.log(`getDiscoverMovies`)),
        catchError(this.handleError<Country[]>('getDiscoverMovies', []))
      );
  }
}
