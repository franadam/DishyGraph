import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import * as endpointType from 'src/app/endpoint.interface';
import { Hierarchy, Pie } from '../graphData.interface';
import CountryDictionary, {Country} from '../country.interface';

import { ApiClientService } from '../api-client.service';
import { D3Service } from '../d3.service';
import Disease from '../disease.interface';
import { Observable } from 'rxjs';

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
  malaria: Pie[] = [];
  cholera: Pie[] = [];
  measles: Pie[] = [];
  tuberculosis: Pie[] = [];
  rubella: Pie[] = [];
  diphtheria: Pie[] = [];
  poliomyelitis: Pie[] = [];
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
    this.getData();
  }

  getCountry(): void {
    this.countryCode = `${this.route.snapshot.paramMap.get('code')}`;
    this.country = this.countries[this.countryCode];
    console.log(`this.countryCode`, this.countryCode);
    console.log(`this.countries`, this.countries);
    console.log(`this.country`, this.country);
  }

  getData(): void {
    setTimeout(() => {
      this.pieData = [
        ...this.malaria,
        ...this.cholera,
        ...this.measles,
        ...this.tuberculosis,
        ...this.rubella,
        ...this.diphtheria,
        ...this.poliomyelitis,
      ];
      console.log(`this.pieData`, this.pieData);
    }, 5000);
  }

  getMalaria(): void {
    this.apiService
      .getMalaria()
      .pipe()
      .subscribe((data) => {
        const filteredData = data.filter(
          (d) =>
            d.SpatialDimType === 'COUNTRY' &&
            d.TimeDim === this.year &&
            d.SpatialDim === this.countryCode
        );
        console.log(`getMalaria filteredData`, filteredData);
        this.malaria = this.d3Service.formatToPieData(
          this.d3Service.getDisease(filteredData, 'malaria'),
          'disease'
        );
        console.log(`getMalaria this.malaria`, this.malaria);
      });
  }

  getDiphtheria(): void {
    this.apiService.getDiphtheria().subscribe((data) => {
      //console.log(`getDiphtheria data`, data);
      const filteredData = data.filter(
        (d) =>
          d.SpatialDimType === 'COUNTRY' &&
          d.TimeDim === this.year &&
          d.SpatialDim === this.countryCode
      );
      this.diphtheria = this.d3Service.formatToPieData(
        this.d3Service.getDisease(filteredData, 'diphtheria'),
        'disease'
      );
      console.log(`getMalaria this.diphtheria`, this.diphtheria);
    });
  }

  getCholera(): void {
    this.apiService.getCholera().subscribe((data) => {
      //console.log(`getCholera this.countryCode`, this.countryCode);
      //console.log(`getCholera data`, data);
      const filteredData = data.filter(
        (d) =>
          d.SpatialDimType === 'COUNTRY' &&
          d.TimeDim === this.year &&
          d.SpatialDim === this.countryCode
      );
      //console.log(`getCholera filteredData`, filteredData);
      this.cholera = this.d3Service.formatToPieData(
        this.d3Service.getDisease(filteredData, 'cholera'),
        'disease'
      );
      console.log(`getMalaria this.cholera`, this.cholera);
    });
  }

  getPoliomyelitis(): void {
    this.apiService.getPoliomyelitis().subscribe((data) => {
      //console.log(`getPoliomyelitis data`, data);
      const filteredData = data.filter(
        (d) =>
          d.SpatialDimType === 'COUNTRY' &&
          d.TimeDim === this.year &&
          d.SpatialDim === this.countryCode
      );
      this.poliomyelitis = this.d3Service.formatToPieData(
        this.d3Service.getDisease(filteredData, 'poliomyelitis'),
        'disease'
      );
      console.log(`getMalaria this.poliomyelitis`, this.poliomyelitis);
    });
  }

  getMeasles(): void {
    this.apiService.getMeasles().subscribe((data) => {
      //console.log(`getMeasles data`, data);
      const filteredData = data.filter(
        (d) =>
          d.SpatialDimType === 'COUNTRY' &&
          d.TimeDim === this.year &&
          d.SpatialDim === this.countryCode
      );
      this.measles = this.d3Service.formatToPieData(
        this.d3Service.getDisease(filteredData, 'measles'),
        'disease'
      );
      console.log(`getMalaria this.measles`, this.measles);
    });
  }

  getRubella(): void {
    this.apiService.getRubella().subscribe((data) => {
      //console.log(`getRubella data`, data);
      const filteredData = data.filter(
        (d) =>
          d.SpatialDimType === 'COUNTRY' &&
          d.TimeDim === this.year &&
          d.SpatialDim === this.countryCode
      );
      this.rubella = this.d3Service.formatToPieData(
        this.d3Service.getDisease(filteredData, 'rubella'),
        'disease'
      );
      console.log(`getMalaria this.rubella`, this.rubella);
    });
  }

  getTuberculosis(): void {
    this.apiService.getTuberculosis().subscribe((data) => {
      //console.log(`getTuberculosis data`, data);
      const filteredData = data.filter(
        (d) =>
          d.SpatialDimType === 'COUNTRY' &&
          d.TimeDim === this.year &&
          d.SpatialDim === this.countryCode
      );
      //console.log(`getTuberculosis filteredData`, filteredData);
      this.tuberculosis = this.d3Service.formatToPieData(
        this.d3Service.getDisease(filteredData, 'tuberculosis'),
        'disease'
      );
      console.log(`getMalaria this.tuberculosis`, this.tuberculosis);
    });
  }
}
