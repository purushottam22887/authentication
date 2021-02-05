import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetInformationComponent } from './components/get-information/get-information.component';
import { HomeComponent } from './layout/home/home.component';


const routes: Routes = [
  {path:"",component:HomeComponent,children:[
    {path:"**",component:GetInformationComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
