import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BubbleComponent } from './home/bubble/bubble.component';
import { PieComponent } from './d3/pie/pie.component';
import { MalariaComponent } from './disease/malaria/malaria.component';
import { BarComponent } from './d3/bar/bar.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, NavbarComponent, BubbleComponent, PieComponent, MalariaComponent, BarComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FontAwesomeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
