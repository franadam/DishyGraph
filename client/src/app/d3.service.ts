import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';

import CountryDictionary from './country.interface';
import Disease from './disease.interface';
import * as endpointType from './endpoint.interface';
import { Pie, Hierarchy } from './graphData.interface';

@Injectable({
  providedIn: 'root',
})
export class D3Service {
  constructor(private apiService: ApiClientService) {
    this.getCountries();
  }

  countries: CountryDictionary = {};

  private getCountries(): void {
    this.apiService.getCountries().subscribe((data) => {
      const countries = data.map(
        ({ Code, Title, ParentCode, ParentTitle }: endpointType.Country) => ({
          name: Title,
          code: Code,
          regionName: ParentTitle,
          regionCode: ParentCode,
          value: 0,
        })
      );
      countries.forEach((c) => {
        this.countries[c.code] = c;
      });
    });
  }

  getDisease(data: endpointType.Disease[], name: string) {
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

  formatToHierarchyData(data: endpointType.Disease[], disease: string) {
    console.log(`d3service`, data);
    return data.map((curr) => {
      const countryCode = curr.SpatialDim;
      const countryName = this.countries[countryCode].name;
      const regionName = this.countries[countryCode].regionName || 'Other';
      const regionCode = this.countries[countryCode].regionCode || 'Other';
      return {
        countryName,
        countryCode,
        regionName,
        regionCode,
        value: curr.NumericValue,
        year: curr.TimeDim,
        disease,
      };
    });
  }

  formatToPieData(data: Disease[], type: string) {
    const pieResult: Pie[] = [];
    switch (type) {
      case 'region':
        return data.reduce((acc, curr) => {
          const name = this.countries[curr.place].regionName || curr.place;
          const code = this.countries[curr.place].regionCode || curr.place;
          const parent = acc.find((r) => r.name === name);
          if (!parent) {
            acc.push({ name, code, value: curr.value });
            return acc;
          } else {
            const newAcc = acc.filter((r) => r.name !== name);
            newAcc.push({
              ...parent,
              value: parent.value + curr.value,
            });
            return newAcc;
          }
        }, pieResult);
      case 'disease':
        return data.reduce((acc, curr) => {
          const name = curr.name;
          const parent = acc.find((r) => r.name === name);
          if (!parent) {
            acc.push({ name, value: curr.value });
            return acc;
          } else {
            const newAcc = acc.filter((r) => r.name !== name);
            newAcc.push({
              ...parent,
              value: parent.value + curr.value,
            });
            return newAcc;
          }
        }, pieResult);
      default:
        return [];
    }
  }
}
