import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnamnesisComponent } from './anamnesis.component';

const routes: Routes = [{ path: '', component: AnamnesisComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnamnesisRoutingModule { }
