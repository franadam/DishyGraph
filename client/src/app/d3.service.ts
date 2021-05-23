import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';
import * as d3 from 'd3';

import CountryDictionary from './country.interface';
import Disease from './disease.interface';
import { Pie } from './graphData.interface';
import dimension from './d3.interface';

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

  createSvg(svgDims: dimension, graphDims: dimension, margin: dimension) {
    const svg = d3
      .select('figure#bubble')
      .append('svg')
      .attr('width', svgDims.width)
      .attr('height', svgDims.height);
    const graph = svg
      .append('g')
      .attr('width', graphDims.width)
      .attr('height', graphDims.height)
      .attr('transform', `translate(${margin.width},  ${margin.height})`);

    return [svg, graph];
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
