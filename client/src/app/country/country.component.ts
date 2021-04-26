import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, forkJoin } from 'rxjs';
import { map} from 'rxjs/operators';

import * as endpointType from 'src/app/endpoint.interface';
import { Hierarchy, Pie } from '../graphData.interface';
import CountryDictionary, { Country } from '../country.interface';

import { ApiClientService } from '../api-client.service';
import { D3Service } from '../d3.service';
//import Disease from '../disease.interface';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
})
export class CountryComponent implements OnInit {
  constructor(
    private apiService: ApiClientService,
    private d3Service: D3Service,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  countries: CountryDictionary = {};
  countryCode = '';
  country: Country = {
    code: '',
    name: '',
    regionCode: '',
    regionName: '',
    value: 0,
  };
  data: endpointType.Disease[] = [];
  pieData: Pie[] = [];
  diseases: Pie[] = [];
  year = 2009;
  pieTitle = `Estimated case of Malaria by region in ${this.year}`;

  ngOnInit(): void {
    this.countries = this.d3Service.countries;
    this.getCountry();
    this.getData();
  }

  getCountry(): void {
    this.countryCode = `${this.route.snapshot.paramMap.get('code')}`;
    this.country = this.countries[this.countryCode];
    //console.log(`this.countryCode`, this.countryCode);
    //console.log(`this.countries`, this.countries);
    //console.log(`this.country`, this.country);
  }

  getData(): void {
    const $malaria = this.getMalaria();
    const $measles = this.getMeasles();
    const $cholera = this.getCholera();
    const $tuberculosis = this.getTuberculosis();
    const $rubella = this.getRubella();
    const $diphtheria = this.getDiphtheria();
    const $poliomyelitis = this.getPoliomyelitis();
    const pieData: Pie[] = [];
    forkJoin(
      $malaria,
      $measles,
      $cholera,
      $tuberculosis,
      $rubella,
      $diphtheria,
      $poliomyelitis
    ).subscribe((data) => {
      this.pieData = pieData.concat(...data);
      console.log(`mergeAll data`, pieData.concat(...data));
    });
  }

  getMalaria(): Observable<Pie[]> {
    return this.apiService.getMalaria().pipe(
      map((endpointData) => {
        const filteredData = endpointData.filter((d) => {
          return (
            d.SpatialDimType === 'COUNTRY' &&
            d.TimeDim === this.year &&
            d.SpatialDim === this.countryCode
          );
        });
        return this.d3Service.formatToPieData(
          this.d3Service.getDisease(filteredData, 'malaria'),
          'disease'
        );
      })
    );
  }

  getDiphtheria(): Observable<Pie[]> {
    return this.apiService.getDiphtheria().pipe(
      map((endpointData) => {
        const filteredData = endpointData.filter((d) => {
          return (
            d.SpatialDimType === 'COUNTRY' &&
            d.TimeDim === this.year &&
            d.SpatialDim === this.countryCode
          );
        });
        return this.d3Service.formatToPieData(
          this.d3Service.getDisease(filteredData, 'diphtheria'),
          'disease'
        );
      })
    );
  }

  getCholera(): Observable<Pie[]> {
    return this.apiService.getCholera().pipe(
      map((endpointData) => {
        const filteredData = endpointData.filter((d) => {
          return (
            d.SpatialDimType === 'COUNTRY' &&
            d.TimeDim === this.year &&
            d.SpatialDim === this.countryCode
          );
        });
        return this.d3Service.formatToPieData(
          this.d3Service.getDisease(filteredData, 'cholera'),
          'disease'
        );
      })
    );
  }

  getPoliomyelitis(): Observable<Pie[]> {
    return this.apiService.getPoliomyelitis().pipe(
      map((endpointData) => {
        const filteredData = endpointData.filter((d) => {
          return (
            d.SpatialDimType === 'COUNTRY' &&
            d.TimeDim === this.year &&
            d.SpatialDim === this.countryCode
          );
        });
        return this.d3Service.formatToPieData(
          this.d3Service.getDisease(filteredData, 'poliomyelitis'),
          'disease'
        );
      })
    );
  }

  getMeasles(): Observable<Pie[]> {
    return this.apiService.getMeasles().pipe(
      map((endpointData) => {
        const filteredData = endpointData.filter((d) => {
          return (
            d.SpatialDimType === 'COUNTRY' &&
            d.TimeDim === this.year &&
            d.SpatialDim === this.countryCode
          );
        });
        return this.d3Service.formatToPieData(
          this.d3Service.getDisease(filteredData, 'measles'),
          'disease'
        );
      })
    );
  }

  getRubella(): Observable<Pie[]> {
    return this.apiService.getRubella().pipe(
      map((endpointData) => {
        const filteredData = endpointData.filter((d) => {
          return (
            d.SpatialDimType === 'COUNTRY' &&
            d.TimeDim === this.year &&
            d.SpatialDim === this.countryCode
          );
        });
        return this.d3Service.formatToPieData(
          this.d3Service.getDisease(filteredData, 'rubella'),
          'disease'
        );
      })
    );
  }

  getTuberculosis(): Observable<Pie[]> {
    return this.apiService.getTuberculosis().pipe(
      map((endpointData) => {
        const filteredData = endpointData.filter((d) => {
          return (
            d.SpatialDimType === 'COUNTRY' &&
            d.TimeDim === this.year &&
            d.SpatialDim === this.countryCode
          );
        });
        return this.d3Service.formatToPieData(
          this.d3Service.getDisease(filteredData, 'tuberculosis'),
          'disease'
        );
      })
    );
  }
}
