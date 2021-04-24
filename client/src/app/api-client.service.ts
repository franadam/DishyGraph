import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import Country from './country.interface';
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

  getCountries(): Observable<Country[]> {
    return this.http
      .get<Country[]>(`${this.baseURL}/countries`, this.httpOptions)
      .pipe(catchError(this.handleError<Country[]>('getCountries', [])));
  }

  getMalaria(): Observable<Disease[]> {
    return this.http
      .get<Disease[]>(`${this.baseURL}/disease/malaria`, this.httpOptions)
      .pipe(catchError(this.handleError<Disease[]>('getMalaria', [])));
  }

  getDiphtheria(): Observable<any> {
    return this.http
      .get(`${this.baseURL}/disease/diphtheria`, this.httpOptions)
      .pipe(catchError(this.handleError('getDiphtheria', [])));
  }

  getCholera(): Observable<any> {
    return this.http
      .get(`${this.baseURL}/disease/cholera`, this.httpOptions)
      .pipe(catchError(this.handleError('getCholera', [])));
  }

  getPoliomyelitis(): Observable<any> {
    return this.http
      .get(`${this.baseURL}/disease/poliomyelitis`, this.httpOptions)
      .pipe(catchError(this.handleError('getPoliomyelitis', [])));
  }
}
