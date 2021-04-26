import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as endpointType from './endpoint.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  constructor(private http: HttpClient) {}

  baseURL = 'http://localhost:3000/api';

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

  getCountries(): Observable<endpointType.Country[]> {
    return this.http
      .get<endpointType.Country[]>(`${this.baseURL}/countries`, this.httpOptions)
      .pipe(
        catchError(this.handleError<endpointType.Country[]>('getCountries', []))
      );
  }

  getMalaria(): Observable<endpointType.Disease[]> {
    return this.http
      .get<endpointType.Disease[]>(`${this.baseURL}/disease/malaria`, this.httpOptions)
      .pipe(catchError(this.handleError<endpointType.Disease[]>('getMalaria', [])));
  }

  getDiphtheria(): Observable<endpointType.Disease[]> {
    return this.http
      .get<endpointType.Disease[]>(`${this.baseURL}/disease/diphtheria`, this.httpOptions)
      .pipe(catchError(this.handleError<endpointType.Disease[]>('getDiphtheria', [])));
  }

  getCholera(): Observable<endpointType.Disease[]> {
    return this.http
      .get<endpointType.Disease[]>(`${this.baseURL}/disease/cholera`, this.httpOptions)
      .pipe(catchError(this.handleError<endpointType.Disease[]>('getCholera', [])));
  }

  getPoliomyelitis(): Observable<endpointType.Disease[]> {
    return this.http
      .get<endpointType.Disease[]>(`${this.baseURL}/disease/poliomyelitis`, this.httpOptions)
      .pipe(catchError(this.handleError<endpointType.Disease[]>('getPoliomyelitis', [])));
  }

  getRubella(): Observable<endpointType.Disease[]> {
    return this.http
      .get<endpointType.Disease[]>(`${this.baseURL}/disease/rubella`, this.httpOptions)
      .pipe(catchError(this.handleError<endpointType.Disease[]>('getRubella', [])));
  }

  getMeasles(): Observable<endpointType.Disease[]> {
    return this.http
      .get<endpointType.Disease[]>(`${this.baseURL}/disease/measles`, this.httpOptions)
      .pipe(catchError(this.handleError<endpointType.Disease[]>('getMeasles', [])));
  }

  getTuberculosis(): Observable<endpointType.Disease[]> {
    return this.http
      .get<endpointType.Disease[]>(`${this.baseURL}/disease/tuberculosis`, this.httpOptions)
      .pipe(catchError(this.handleError<endpointType.Disease[]>('getTuberculosis', [])));
  }
}
