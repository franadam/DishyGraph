import { Component, OnInit } from '@angular/core';

import { ApiClientService } from 'src/app/api-client.service';
import { D3Service } from 'src/app/d3.service';

import * as graphType from 'src/app/graphData.interface';
import CountryDictionary, { Country } from 'src/app/country.interface';
import Disease from 'src/app/disease.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-malaria',
  templateUrl: './malaria.component.html',
  styleUrls: ['./malaria.component.css'],
})
export class MalariaComponent implements OnInit {
  constructor(
    private apiService: ApiClientService,
    private d3Service: D3Service,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  diseaseName = '';
  contactForm!: FormGroup;
  years: { id: number; year: number }[] = [];
  year: { id: number; year: number } = { id: 9, year: 2009 };
  $data: Observable<Disease[]> = new BehaviorSubject([]);
  data: Disease[] = [];
  dataFull: Disease[] = [];
  countries: CountryDictionary = {};
  pieData: graphType.Pie[] = [];
  hierarchyData: graphType.Hierarchy[] = [];
  pieTitle = `Estimated case of Malaria by region in ${this.year.year}`;

  ngOnInit(): void {
    this.diseaseName = `${this.route.snapshot.paramMap.get('name')}`;
    this.getMalaria();
    // this.getDisease();
    this.getCountries();
  }

  private getCountries(): void {
    this.apiService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  clickHandler = (countryCode: string) => {
    this.router.navigateByUrl(`/country/${countryCode}`);
  }

  submit(): void {
    this.year = {
      id: this.contactForm.value.year,
      year: this.years[this.contactForm.value.year].year,
    };
    this.data = this.dataFull.filter((d) => d.time === this.year.year);
    this.pieData = this.d3Service.formatToPieData(this.data, 'region');
    this.pieTitle = `Estimated case of Malaria by region in ${this.year.year}`;
    const hierarchyData = this.d3Service.formatToHierarchyData(
      this.data,
      'malaria'
    );
    this.hierarchyData = this.d3Service
      .formatToHierarchyData(this.data, 'malaria')
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
  }

  getCholera(): Observable<graphType.Hierarchy[]> {
    return this.apiService.getMalaria().pipe(
      map((endpointData) => {
        const filteredData = endpointData.filter((d) => {
          return d.time;
        });
        return this.d3Service.formatToHierarchyData(filteredData, 'cholera');
      })
    );
  }

  getDisease(): void {
    this.diseaseName = `${this.route.snapshot.paramMap.get('name')}`;
    switch (this.diseaseName) {
      case 'malaria':
        this.apiService
          .getMalaria()
          .subscribe((data) => this.diseaseHelper(data));
        break;

      case 'diphtheria':
        this.apiService
          .getDiphtheria()
          .subscribe((data) => this.diseaseHelper(data));
        break;
      case 'cholera':
        this.apiService
          .getCholera()
          .subscribe((data) => this.diseaseHelper(data));
        break;
      case 'poliomyelitis':
        this.apiService
          .getPoliomyelitis()
          .subscribe((data) => this.diseaseHelper(data));
        break;
      case 'rubella':
        this.apiService
          .getRubella()
          .subscribe((data) => this.diseaseHelper(data));
        break;
      case 'tuberculosis':
        this.apiService
          .getTuberculosis()
          .subscribe((data) => this.diseaseHelper(data));
        break;
      case 'measles':
        this.apiService
          .getMeasles()
          .subscribe((data) => this.diseaseHelper(data));
        break;
      default:
        break;
    }
  }

  private diseaseHelper = (data: Disease[]) => {
    this.dataFull = data;
    this.years = [...new Set(this.dataFull.map((d) => d.time))].map((d, i) => ({
      id: i,
      year: d,
    }));
    this.data = data.filter((d) => d.time === this.year.year);
    this.pieData = this.d3Service.formatToPieData(this.data, 'region');
    const hierarchyData = this.d3Service.formatToHierarchyData(
      this.data,
      this.diseaseName
    );
    this.hierarchyData = hierarchyData
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
  }

  getMalaria(): void {
    this.apiService.getMalaria().subscribe((data) => {
      this.dataFull = data;
      this.years = [...new Set(this.dataFull.map((d) => d.time))].map(
        (d, i) => ({
          id: i,
          year: d,
        })
      );
      this.year = this.years.slice(-1)[0];
      this.contactForm = this.formBuilder.group({
        year: [this.year.id],
      });
      this.pieTitle = `Estimated case of Malaria by region in ${this.year.year}`;
      this.data = data.filter((d) => d.time === this.year.year);
      this.pieData = this.d3Service.formatToPieData(this.data, 'region');
      const hierarchyData = this.d3Service.formatToHierarchyData(
        this.data,
        'malaria'
      );
      this.hierarchyData = hierarchyData
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);
    });
  }
}
