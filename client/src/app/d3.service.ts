import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';
import * as d3 from 'd3';

import CountryDictionary from './country.interface';
import Disease from './disease.interface';
import { Hierarchy, Pie } from './graphData.interface';

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

  formatToHierarchyData(data: Disease[], disease: string): Hierarchy[] {
    console.log(`d3service`, data);
    const res: Hierarchy[] = [];
    data.forEach((curr) => {
      const countryCode = curr.place;
      if (this.countries[countryCode]) {
        const countryName = this.countries[countryCode].name;
        const regionName = this.countries[countryCode].regionName || 'Other';
        const regionCode = this.countries[countryCode].regionCode || 'Other';
        res.push({
          countryName,
          countryCode,
          regionName,
          regionCode,
          value: curr.value,
          year: curr.time,
          disease,
        });
      }
    });

    return res;
  }

  formatToPieData(data: Disease[], type: string): Pie[] {
    let pieResult: Pie[] = [];
    switch (type) {
      case 'region':
        data.forEach((disease) => {
          if (disease.place) {
            const name =
              this.countries[disease.place].regionName || disease.place;
            const code =
              this.countries[disease.place].regionCode || disease.place;
            const parent = pieResult.find((r) => r.name === name);
            if (!parent) {
              pieResult.push({ name, code, value: disease.value });
            } else {
              pieResult = pieResult.filter((r) => r.name !== name);
              pieResult.push({
                ...parent,
                value: parent.value + disease.value,
              });
            }
          }
        });
        return pieResult;
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
        data.forEach((disease) => {
          if (disease.place) {
            const name = disease.name;
            const parent = pieResult.find((r) => r.name === name);

            if (!parent) {
              pieResult.push({ name, value: disease.value });
            } else {
              pieResult = pieResult.filter((r) => r.name !== name);
              pieResult.push({
                ...parent,
                value: parent.value + disease.value,
              });
            }
          }
        });
        return pieResult;
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
