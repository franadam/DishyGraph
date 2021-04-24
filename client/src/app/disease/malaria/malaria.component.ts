import { Component, OnInit } from '@angular/core';
import { ApiClientService } from 'src/app/api-client.service';
import Country from 'src/app/country.interface';
import Disease from 'src/app/disease.interface';

@Component({
  selector: 'app-malaria',
  templateUrl: './malaria.component.html',
  styleUrls: ['./malaria.component.css'],
})
export class MalariaComponent implements OnInit {
  constructor(private apiService: ApiClientService) {}

  data: Disease[] = [];
  countries: Country[] = [];

  ngOnInit(): void {
    this.getMalaria();
    this.getCountries();
  }

  getCountries(): void {
    this.apiService.getCountries().subscribe((countries) => {
      console.log(`countries`, countries);
      this.countries = countries;
    });
  }

  getMalaria(): void {
    this.apiService.getMalaria().subscribe((data) => {
      console.log(`getMalaria data`, data);
      this.data = data.filter((d) => d.TimeDim === 2000);
    });
  }
}
