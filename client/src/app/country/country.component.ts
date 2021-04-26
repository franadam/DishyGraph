import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import Country, { CountryDictionary } from '../country.interface';
import Disease from '../disease.interface';
import { Hierarchy, Pie } from '../graphData.interface';

import { ApiClientService } from '../api-client.service';
import { D3Service } from '../d3.service';

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
    Code: '',
    Title: '',
    ParentDimension: '',
    Dimension: '',
    ParentCode: '',
    ParentTitle: '',
  };
  data: Disease[] = [];
  pieData: Pie[] = [];
  diseases: Hierarchy[] = [];
  malaria: Hierarchy[] = [];
  cholera: Hierarchy[] = [];
  measles: Hierarchy[] = [];
  tuberculosis: Hierarchy[] = [];
  rubella: Hierarchy[] = [];
  diphtheria: Hierarchy[] = [];
  poliomyelitis: Hierarchy[] = [];
  year = 2009;

  ngOnInit(): void {
    this.countries = this.d3Service.countries;
    this.getCountry();
    this.getMalaria();
    this.getCholera();
    this.getMeasles();
    this.getTuberculosis();
    this.getRubella();
    this.getDiphtheria();
    this.getPoliomyelitis();
  }

  getCountry(): void {
    this.countryCode = `${this.route.snapshot.paramMap.get('code')}`;
    this.country = this.countries[this.countryCode];
    console.log(`this.countryCode`, this.countryCode);
    console.log(`this.countries`, this.countries);
    console.log(`this.country`, this.country);
  }

  getMalaria(): void {
    this.apiService.getMalaria().subscribe((data) => {
      const filteredData = data.filter(
        (d) =>
          d.SpatialDimType === 'COUNTRY' && d.SpatialDim === this.countryCode
      );
      console.log(`getMalaria filteredData`, filteredData);
      this.malaria = this.d3Service.formatToHierarchyData(
        filteredData,
        'malaria'
      );
    });
  }

  getDiphtheria(): void {
    this.apiService.getDiphtheria().subscribe((data) => {
      console.log(`getDiphtheria data`, data);
      const filteredData = data.filter(
        (d) =>
          d.SpatialDimType === 'COUNTRY' && d.SpatialDim === this.countryCode
      );
      this.diphtheria = this.d3Service.formatToHierarchyData(
        filteredData,
        'diphtheria'
      );
    });
  }

  getCholera(): void {
    this.apiService.getCholera().subscribe((data) => {
      console.log(`getCholera data`, data);
      const filteredData = data.filter(
        (d) =>
          d.SpatialDimType === 'COUNTRY' && d.SpatialDim === this.countryCode
      );
      console.log(`getCholera filteredData`, filteredData);
      this.cholera = this.d3Service.formatToHierarchyData(
        filteredData,
        'cholera'
      );
    });
  }

  getPoliomyelitis(): void {
    this.apiService.getPoliomyelitis().subscribe((data) => {
      console.log(`getPoliomyelitis data`, data);
      const filteredData = data.filter(
        (d) =>
          d.SpatialDimType === 'COUNTRY' && d.SpatialDim === this.countryCode
      );
      this.poliomyelitis = this.d3Service.formatToHierarchyData(
        filteredData,
        'poliomyelitis'
      );
    });
  }

  getMeasles(): void {
    this.apiService.getMeasles().subscribe((data) => {
      console.log(`getMeasles data`, data);
      const filteredData = data.filter(
        (d) =>
          d.SpatialDimType === 'COUNTRY' && d.SpatialDim === this.countryCode
      );
      this.measles = this.d3Service.formatToHierarchyData(
        filteredData,
        'measles'
      );
    });
  }

  getRubella(): void {
    this.apiService.getRubella().subscribe((data) => {
      console.log(`getRubella data`, data);
      const filteredData = data.filter(
        (d) =>
          d.SpatialDimType === 'COUNTRY' && d.SpatialDim === this.countryCode
      );
      this.rubella = this.d3Service.formatToHierarchyData(
        filteredData,
        'rubella'
      );
    });
  }

  getTuberculosis(): void {
    this.apiService.getTuberculosis().subscribe((data) => {
      console.log(`getTuberculosis data`, data);
      const filteredData = data.filter(
        (d) =>
          d.SpatialDimType === 'COUNTRY' && d.SpatialDim === this.countryCode
      );
      this.tuberculosis = this.d3Service.formatToHierarchyData(
        filteredData,
        'tuberculosis'
      );
    });
  }
}
