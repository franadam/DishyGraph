import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import * as endpointType from './endpoint.interface';
import Disease from './disease.interface';
import CountryDictionary from './country.interface';

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

  private handleError<T>(
    operation = 'operation',
    result?: T
  ): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  toDiseaseType(data: endpointType.Disease[], name: string): Disease[] {
    return data.map(
      ({ NumericValue, SpatialDimType, SpatialDim, TimeDimType, TimeDim }) => ({
        name,
        value: NumericValue,
        placeDim: SpatialDimType,
        place: SpatialDim,
        timeDim: TimeDimType,
        time: TimeDim,
      })
    );
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
      .get<endpointType.Disease[]>(
        `${this.baseURL}/disease/malaria`,
        this.httpOptions
      )
      .pipe(
        map((endpointData) => {
          return this.toDiseaseType(endpointData, 'malaria');
        }),
        catchError(this.handleError<Disease[]>('getMalaria', []))
      );
  }

  getDiphtheria(): Observable<Disease[]> {
    return this.http
      .get<endpointType.Disease[]>(
        `${this.baseURL}/disease/diphtheria`,
        this.httpOptions
      )
      .pipe(
        map((endpointData) => {
          return this.toDiseaseType(endpointData, 'diphtheria');
        }),
        catchError(this.handleError<Disease[]>('getDiphtheria', []))
      );
  }

  getCholera(): Observable<Disease[]> {
    return this.http
      .get<endpointType.Disease[]>(
        `${this.baseURL}/disease/cholera`,
        this.httpOptions
      )
      .pipe(
        map((endpointData) => {
          return this.toDiseaseType(endpointData, 'cholera');
        }),
        catchError(this.handleError<Disease[]>('getCholera', []))
      );
  }

  getPoliomyelitis(): Observable<Disease[]> {
    return this.http
      .get<endpointType.Disease[]>(
        `${this.baseURL}/disease/poliomyelitis`,
        this.httpOptions
      )
      .pipe(
        map((endpointData) => {
          return this.toDiseaseType(endpointData, 'poliomyelitis');
        }),
        catchError(this.handleError<Disease[]>('getPoliomyelitis', []))
      );
  }

  getRubella(): Observable<Disease[]> {
    return this.http
      .get<endpointType.Disease[]>(
        `${this.baseURL}/disease/rubella`,
        this.httpOptions
      )
      .pipe(
        map((endpointData) => {
          return this.toDiseaseType(endpointData, 'rubella');
        }),
        catchError(this.handleError<Disease[]>('getRubella', []))
      );
  }

  getMeasles(): Observable<Disease[]> {
    return this.http
      .get<endpointType.Disease[]>(
        `${this.baseURL}/disease/measles`,
        this.httpOptions
      )
      .pipe(
        map((endpointData) => {
          return this.toDiseaseType(endpointData, 'measles');
        }),
        catchError(this.handleError<Disease[]>('getMeasles', []))
      );
  }

  getTuberculosis(): Observable<Disease[]> {
    return this.http
      .get<endpointType.Disease[]>(
        `${this.baseURL}/disease/tuberculosis`,
        this.httpOptions
      )
      .pipe(
        map((endpointData) => {
          return this.toDiseaseType(endpointData, 'tuberculosis');
        }),
        catchError(this.handleError<Disease[]>('getTuberculosis', []))
      );
  }
}
