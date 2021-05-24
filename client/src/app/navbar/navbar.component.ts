import { Component, OnInit } from '@angular/core';
import {
  faVirus,
  faMapMarkedAlt,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor() {}

  faMapMarkedAlt = faMapMarkedAlt;
  faVirus = faVirus;
  faSearch = faSearch;
  ngOnInit(): void {}
}
