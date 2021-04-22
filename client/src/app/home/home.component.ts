import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../api-client.service';
import Country from '../country.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private apiService: ApiClientService) { }

  countries : Country [] = [];

  ngOnInit(): void {
    this.getCountries();
  }

  getCountries() : void {
    this.apiService.getCountries().subscribe(countries => {
      console.log(`countries`, countries)
      this.countries = countries;
    })
  }
}
