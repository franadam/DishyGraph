import { Component, OnInit } from '@angular/core';

import { ApiClientService } from '../api-client.service';
import { D3Service } from '../d3.service';

import * as graphType from 'src/app/graphData.interface';
import CountryDictionary from '../country.interface';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  diseases: graphType.Hierarchy[] = [];
  year = 2018;

  ngOnInit(): void {
    this.getCountries();
    this.getData();
  }

  private getCountries(): void {
    this.apiService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  getData(): void {
    const $malaria = this.getMalaria();
    const $measles = this.getMeasles();
    const $cholera = this.getCholera();
    const $tuberculosis = this.getTuberculosis();
    const $rubella = this.getRubella();
    const $diphtheria = this.getDiphtheria();
    const $poliomyelitis = this.getPoliomyelitis();
    const hierarchyData: graphType.Hierarchy[] = [];
    forkJoin(
      // $malaria,
      [$measles, $cholera, $tuberculosis, $rubella, $diphtheria, $poliomyelitis]
    ).subscribe((data) => {
      this.diseases = hierarchyData.concat(...data);
    });
  }

  getMalaria(): Observable<graphType.Hierarchy[]> {
    return this.apiService.getMalaria().pipe(
      map((endpointData) => {
        const filteredData = endpointData.filter((d) => {
          return d.time === this.year && d.placeDim === 'COUNTRY';
        });
        return this.d3Service.formatToHierarchyData(filteredData, 'malaria');
      })
    );
  }

  getDiphtheria(): Observable<graphType.Hierarchy[]> {
    return this.apiService.getDiphtheria().pipe(
      map((endpointData) => {
        const filteredData = endpointData.filter((d) => {
          return d.time === this.year && d.placeDim === 'COUNTRY';
        });
        return this.d3Service.formatToHierarchyData(filteredData, 'diphtheria');
      })
    );
  }

  getCholera(): Observable<graphType.Hierarchy[]> {
    return this.apiService.getCholera().pipe(
      map((endpointData) => {
        const filteredData = endpointData.filter((d) => {
          return d.time === this.year && d.placeDim === 'COUNTRY';
        });
        return this.d3Service.formatToHierarchyData(filteredData, 'cholera');
      })
    );
  }

  getPoliomyelitis(): Observable<graphType.Hierarchy[]> {
    return this.apiService.getPoliomyelitis().pipe(
      map((endpointData) => {
        const filteredData = endpointData.filter((d) => {
          return d.time === this.year && d.placeDim === 'COUNTRY';
        });
        return this.d3Service.formatToHierarchyData(
          filteredData,
          'poliomyelitis'
        );
      })
    );
  }

  getMeasles(): Observable<graphType.Hierarchy[]> {
    return this.apiService.getMeasles().pipe(
      map((endpointData) => {
        const filteredData = endpointData.filter((d) => {
          return d.time === this.year && d.placeDim === 'COUNTRY';
        });
        return this.d3Service.formatToHierarchyData(filteredData, 'measles');
      })
    );
  }

  getRubella(): Observable<graphType.Hierarchy[]> {
    return this.apiService.getRubella().pipe(
      map((endpointData) => {
        const filteredData = endpointData.filter((d) => {
          return d.time === this.year && d.placeDim === 'COUNTRY';
        });
        return this.d3Service.formatToHierarchyData(filteredData, 'rubella');
      })
    );
  }

  getTuberculosis(): Observable<graphType.Hierarchy[]> {
    return this.apiService.getTuberculosis().pipe(
      map((endpointData) => {
        const filteredData = endpointData.filter((d) => {
          return d.time === this.year && d.placeDim === 'COUNTRY';
        });
        return this.d3Service.formatToHierarchyData(
          filteredData,
          'tuberculosis'
        );
      })
    );
  }
}
