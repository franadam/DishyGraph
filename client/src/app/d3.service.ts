import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';

import CountryDictionary from './country.interface';
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
    this.apiService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  formatToHierarchyData(data: Disease[], disease: string) {
    console.log(`d3service`, data);
    return data.map((curr) => {
      const countryCode = curr.place;
      const countryName = this.countries[countryCode].name;
      const regionName = this.countries[countryCode].regionName || 'Other';
      const regionCode = this.countries[countryCode].regionCode || 'Other';
      return {
        countryName,
        countryCode,
        regionName,
        regionCode,
        value: curr.value,
        year: curr.time,
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
