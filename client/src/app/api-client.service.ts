import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import Country, { CountryDictionary } from './country.interface';
import Disease from './disease.interface';

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

  getCountries(): Observable<CountryDictionary> {
    return this.http
      .get<CountryDictionary>(`${this.baseURL}/countries`, this.httpOptions)
      .pipe(
        catchError(this.handleError<CountryDictionary>('getCountries', {}))
      );
  }

  getMalaria(): Observable<Disease[]> {
    return this.http
      .get<Disease[]>(`${this.baseURL}/disease/malaria`, this.httpOptions)
      .pipe(catchError(this.handleError<Disease[]>('getMalaria', [])));
  }

  getDiphtheria(): Observable<Disease[]> {
    return this.http
      .get<Disease[]>(`${this.baseURL}/disease/diphtheria`, this.httpOptions)
      .pipe(catchError(this.handleError<Disease[]>('getDiphtheria', [])));
  }

  getCholera(): Observable<Disease[]> {
    return this.http
      .get<Disease[]>(`${this.baseURL}/disease/cholera`, this.httpOptions)
      .pipe(catchError(this.handleError<Disease[]>('getCholera', [])));
  }

  getPoliomyelitis(): Observable<Disease[]> {
    return this.http
      .get<Disease[]>(`${this.baseURL}/disease/poliomyelitis`, this.httpOptions)
      .pipe(catchError(this.handleError<Disease[]>('getPoliomyelitis', [])));
  }

  getRubella(): Observable<Disease[]> {
    return this.http
      .get<Disease[]>(`${this.baseURL}/disease/rubella`, this.httpOptions)
      .pipe(catchError(this.handleError<Disease[]>('getRubella', [])));
  }

  getMeasles(): Observable<Disease[]> {
    return this.http
      .get<Disease[]>(`${this.baseURL}/disease/measles`, this.httpOptions)
      .pipe(catchError(this.handleError<Disease[]>('getMeasles', [])));
  }

  getTuberculosis(): Observable<Disease[]> {
    return this.http
      .get<Disease[]>(`${this.baseURL}/disease/tuberculosis`, this.httpOptions)
      .pipe(catchError(this.handleError<Disease[]>('getTuberculosis', [])));
  }
}
