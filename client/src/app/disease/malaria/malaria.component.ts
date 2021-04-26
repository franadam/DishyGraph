import { Component, OnInit } from '@angular/core';
import { ApiClientService } from 'src/app/api-client.service';
import { D3Service } from 'src/app/d3.service';
import { CountryDictionary } from 'src/app/country.interface';
import * as graphType from 'src/app/graphData.interface';
import Disease from 'src/app/disease.interface';

@Component({
  selector: 'app-malaria',
  templateUrl: './malaria.component.html',
  styleUrls: ['./malaria.component.css'],
})
export class MalariaComponent implements OnInit {
  constructor(
    private apiService: ApiClientService,
    private d3Service: D3Service
  ) {}

  data: Disease[] = [];
  countries: CountryDictionary = {};
  pieData: graphType.Pie[] = [];
  // hierarchyData: graphType.Hierarchy[] = [];
  hierarchyData: any[] = [];
  year = 2000;

  ngOnInit(): void {
    this.getMalaria();
    this.countries = this.d3Service.countries;
  }

  getMalaria(): void {
    this.apiService.getMalaria().subscribe((data) => {
      this.data = data.filter((d) => d.TimeDim === this.year);
      this.pieData = this.d3Service.formatToPieData(this.data);
      const hierarchyData = this.d3Service.formatToHierarchyData(
        this.data,
        'malaria'
      );
      this.hierarchyData = hierarchyData
        .sort((a, b) =>  b.value - a.value)
        .slice(0, 3);
    });
  }
}
