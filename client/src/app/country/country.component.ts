import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import * as endpointType from 'src/app/endpoint.interface';
import { Bar, Pie } from '../graphData.interface';
import CountryDictionary, { Country } from '../country.interface';

import { ApiClientService } from '../api-client.service';
import { D3Service } from '../d3.service';
import Disease from '../disease.interface';
import { faMapMarkerAlt, faUser } from '@fortawesome/free-solid-svg-icons';

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
    capital: '',
    flag: '',
    value: 0,
    population: 0,
  };
  data: endpointType.Disease[] = [];
  pieData: Pie[] = [];
  barData: Bar[] = [];
  year = 2018;
  pieTitle = `Estimated case of infectious disease in ${this.year}`;
  barTitle = `Estimated case of infectious disease by years`;
  periodOfTime = 20;
  faUser = faUser;
  faMapMarkerAlt = faMapMarkerAlt;

  ngOnInit(): void {
    this.countries = this.d3Service.countries;
    this.getCountry();
    this.getPieData();
    this.getBarData();
  }

  getCountry(): void {
    this.countryCode = `${this.route.snapshot.paramMap.get('code')}`;
    this.apiService.getCountries().subscribe((data) => {
      this.countries = data;
      this.country = this.countries[this.countryCode];
      // console.log(`this.countryCode`, this.countryCode);
      console.log(`this.countries`, this.countries);
      console.log(`this.country`, this.country);
    });
  }

  private filterHelper = (d: Disease) => {
    return d.placeDim === 'COUNTRY' && d.place === this.countryCode;
  }

  getPieData(): void {
    const mapHelper = (disease: Disease[]) => {
      const filtered = disease.filter((d) => d.time === this.year);
      return this.d3Service.formatToPieData(filtered, 'disease');
    };

    const $malaria = this.getMalaria().pipe(map(mapHelper));
    const $measles = this.getMeasles().pipe(map(mapHelper));
    const $cholera = this.getCholera().pipe(map(mapHelper));
    const $tuberculosis = this.getTuberculosis().pipe(map(mapHelper));
    const $rubella = this.getRubella().pipe(map(mapHelper));
    const $diphtheria = this.getDiphtheria().pipe(map(mapHelper));
    const $poliomyelitis = this.getPoliomyelitis().pipe(map(mapHelper));
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

  getBarData(): void {
    const $malaria = this.getMalaria();
    const $measles = this.getMeasles();
    const $cholera = this.getCholera();
    const $tuberculosis = this.getTuberculosis();
    const $rubella = this.getRubella();
    const $diphtheria = this.getDiphtheria();
    const $poliomyelitis = this.getPoliomyelitis();
    const barData: Disease[] = [];

    forkJoin(
      $malaria,
      $measles,
      $cholera,
      $tuberculosis,
      $rubella,
      $diphtheria,
      $poliomyelitis
    ).subscribe((data) => {
      const res = barData.concat(...data);
      const dico: {
        [year: string]: { year: number; [disease: string]: number };
      } = {};
      res.reduce((acc, curr) => {
        if (!acc[curr.time]) {
          acc[curr.time] = { year: curr.time, [curr.name]: curr.value };
        } else {
          acc[curr.time] = { ...acc[curr.time], [curr.name]: curr.value };
        }
        return acc;
      }, dico);
      const result: any = Object.values(dico);
      let keys: any = [];
      for (const elem of result) {
        keys = keys.concat(...Object.keys(elem));
      }
      result.__proto__.columns = [...new Set(keys)];
      result.__proto__.yAxisTitle = 'Cases';
      this.barData = result;
    });
  }

  getMalaria = (): Observable<Disease[]> => {
    return this.apiService.getMalaria().pipe(
      map((disease) => {
        return disease.filter((d) => this.filterHelper(d));
      })
    );
  }

  getDiphtheria = (): Observable<Disease[]> => {
    return this.apiService.getDiphtheria().pipe(
      map((disease) => {
        return disease.filter((d) => this.filterHelper(d));
      })
    );
  }

  getCholera = (): Observable<Disease[]> => {
    return this.apiService.getCholera().pipe(
      map((disease) => {
        return disease.filter((d) => this.filterHelper(d));
      })
    );
  }

  getPoliomyelitis = (): Observable<Disease[]> => {
    return this.apiService.getPoliomyelitis().pipe(
      map((disease) => {
        return disease.filter((d) => this.filterHelper(d));
      })
    );
  }

  getMeasles = (): Observable<Disease[]> => {
    return this.apiService.getMeasles().pipe(
      map((disease) => {
        return disease.filter((d) => this.filterHelper(d));
      })
    );
  }

  getRubella = (): Observable<Disease[]> => {
    return this.apiService.getRubella().pipe(
      map((disease) => {
        return disease.filter((d) => this.filterHelper(d));
      })
    );
  }

  getTuberculosis = (): Observable<Disease[]> => {
    return this.apiService.getTuberculosis().pipe(
      map((disease) => {
        return disease.filter((d) => this.filterHelper(d));
      })
    );
  }
}
