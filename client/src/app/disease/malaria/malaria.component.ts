import { Component, OnInit } from '@angular/core';

import { ApiClientService } from 'src/app/api-client.service';
import { D3Service } from 'src/app/d3.service';

import * as graphType from 'src/app/graphData.interface';
//import * as endpointType from 'src/app/endpoint.interface';
import CountryDictionary from 'src/app/country.interface';
import Disease from 'src/app/disease.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-malaria',
  templateUrl: './malaria.component.html',
  styleUrls: ['./malaria.component.css'],
})
export class MalariaComponent implements OnInit {
  constructor(
    private apiService: ApiClientService,
    private d3Service: D3Service,
    private fb: FormBuilder
  ) {
    this.year = 2009; //this.years[this.contactForm.value.year].year;
  }

  contactForm!: FormGroup;
  years: { id: number; year: number }[] = [];
  year: number = 2009;
  $data: Observable<Disease[]> = new BehaviorSubject([]);
  data: Disease[] = [];
  dataFull: Disease[] = [];
  countries: CountryDictionary = {};
  pieData: graphType.Pie[] = [];
  hierarchyData: graphType.Hierarchy[] = [];
  pieTitle = `Estimated case of Malaria by region in ${this.year}`;

  ngOnInit(): void {
    this.getMalaria();
    console.log(`this.data`, this.data);
    this.countries = this.d3Service.countries;
    this.contactForm = this.fb.group({
      year: [9],
    });
  }

  submit() {
    console.log('Form Submitted');
    console.log(this.contactForm.value.year);
    this.year = this.years[this.contactForm.value.year].year;
    this.data = this.dataFull.filter((d) => d.time === this.year);
    this.pieData = this.d3Service.formatToPieData(this.data, 'region');
    console.log(`this.pieData`, this.pieData);
    const hierarchyData = this.d3Service.formatToHierarchyData(
      this.data,
      'malaria'
    );
    this.hierarchyData = this.d3Service
      .formatToHierarchyData(this.data, 'malaria')
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
    console.log(this.year);
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

  getMalaria(): void {
    this.apiService.getMalaria().subscribe((data) => {
      this.dataFull = data;
      this.years = this.dataFull.map((d, i) => ({ id: i, year: d.time }));
      this.data = data.filter((d) => d.time === this.year);
      this.pieData = this.d3Service.formatToPieData(this.data, 'region');
      console.log(`this.pieData`, this.pieData);
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
