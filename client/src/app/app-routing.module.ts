import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MalariaComponent } from './disease/malaria/malaria.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'disease/malaria', component: MalariaComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
