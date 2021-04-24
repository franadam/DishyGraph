import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../api-client.service';
import Country, { CountryDictionary } from '../country.interface';
import { D3Service } from '../d3.service';
import Disease from '../disease.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private apiService: ApiClientService, private d3Service: D3Service) {}

  countries: CountryDictionary = {};
  cdata: Disease[] = [];
  diseases = { malaria: {}, diphtheria: {}, cholera: {}, poliomyelitis: {} };

  ngOnInit(): void {
    this.getMalaria();
    this.getDiphtheria();
    this.getPoliomyelitis();
    this.getCholera();
    this.countries = this.d3Service.countries;
  }

  getMalaria(): void {
    this.apiService.getMalaria().subscribe((data) => {
      console.log(`getMalaria data`, data);
      this.cdata = data;
      this.diseases.malaria = data;
    });
  }

  getDiphtheria(): void {
    this.apiService.getDiphtheria().subscribe((data) => {
      console.log(`getDiphtheria data`, data);
      this.diseases.diphtheria = data;
    });
  }

  getCholera(): void {
    this.apiService.getCholera().subscribe((data) => {
      console.log(`getCholera data`, data);
      this.diseases.cholera = data;
    });
  }

  getPoliomyelitis(): void {
    this.apiService.getPoliomyelitis().subscribe((data) => {
      console.log(`getPoliomyelitis data`, data);
      this.diseases.poliomyelitis = data;
    });
  }
}
