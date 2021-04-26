import { Component, OnInit } from '@angular/core';

import { ApiClientService } from '../api-client.service';
import { D3Service } from '../d3.service';

import * as endpointType from 'src/app/endpoint.interface';
import * as graphType from 'src/app/graphData.interface';
import CountryDictionary from '../country.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private apiService: ApiClientService,
    private d3Service: D3Service
  ) {}

  countries: CountryDictionary = {};
  cdata: endpointType.Disease[] = [];
  diseases: graphType.Hierarchy[] = [];
  malaria: graphType.Hierarchy[] = [];
  cholera: graphType.Hierarchy[] = [];
  measles: graphType.Hierarchy[] = [];
  tuberculosis: graphType.Hierarchy[] = [];
  rubella: graphType.Hierarchy[] = [];
  diphtheria: graphType.Hierarchy[] = [];
  poliomyelitis: graphType.Hierarchy[] = [];
  year = 2009;

  ngOnInit(): void {
    this.countries = this.d3Service.countries;
    this.getMalaria();
    this.getCholera();
    this.getMeasles();
    this.getTuberculosis();
    this.getRubella();
    this.getDiphtheria();
    this.getPoliomyelitis();
    this.getData();
  }

  getData() : void {
    this.diseases = [
      ...this.malaria,
      ...this.cholera,
      ...this.measles,
      ...this.tuberculosis,
      ...this.rubella,
      ...this.diphtheria,
      ...this.poliomyelitis,
    ];
  }

  getMalaria(): void {
    this.apiService.getMalaria().subscribe((data) => {
      const filteredData = data.filter(
        (d) => d.TimeDim === this.year && d.SpatialDimType === 'COUNTRY'
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
        (d) => d.TimeDim === this.year && d.SpatialDimType === 'COUNTRY'
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
        (d) => d.TimeDim === this.year && d.SpatialDimType === 'COUNTRY'
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
        (d) => d.TimeDim === this.year && d.SpatialDimType === 'COUNTRY'
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
        (d) => d.TimeDim === this.year && d.SpatialDimType === 'COUNTRY'
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
        (d) => d.TimeDim === this.year && d.SpatialDimType === 'COUNTRY'
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
        (d) => d.TimeDim === this.year && d.SpatialDimType === 'COUNTRY'
      );
      this.tuberculosis = this.d3Service.formatToHierarchyData(
        filteredData,
        'tuberculosis'
      );
    });
  }
}
