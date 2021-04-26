import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';
import { CountryDictionary } from './country.interface';
import Disease from './disease.interface';
import { Pie } from './graphData.interface';

@Injectable({
  providedIn: 'root',
})
export class D3Service {
  constructor(private apiService: ApiClientService) {
    this.getCountries();
  }

  countries: CountryDictionary = {};

  private getCountries(): void {
    this.apiService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });
  }

  formatToHierarchyData(data: Disease[], disease: string) {
    console.log(`d3service`, data);
    return data.map((curr) => {
      const code = curr.SpatialDim;
      const name = this.countries[code].Title;
      const parentName = this.countries[code].ParentTitle || 'Other';
      const parentCode = this.countries[code].ParentCode || 'Other';
      return {
        name,
        code,
        parentName,
        parentCode,
        value: curr.NumericValue,
        year: curr.TimeDim,
        disease
      };
    });
  }

  formatToPieData(data: Disease[]) {
    const pieResult: Pie[] = [];
    return data.reduce((acc, curr) => {
      const name = this.countries[curr.SpatialDim].ParentTitle || 'Other';
      const code = this.countries[curr.SpatialDim].ParentCode || 'Other';
      const parent = acc.find((r) => r.name === name);
      if (!parent) {
        acc.push({ name, code, value: curr.NumericValue });
        return acc;
      } else {
        const newAcc = acc.filter((r) => r.name !== name);
        newAcc.push({
          ...parent,
          value: parent.value + curr.NumericValue,
        });
        return newAcc;
      }
    }, pieResult);
  }
}
