import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnamnesisRoutingModule } from './anamnesis-routing.module';
import { AnamnesisComponent } from './anamnesis.component';


@NgModule({
  declarations: [AnamnesisComponent],
  imports: [
    CommonModule,
    AnamnesisRoutingModule
  ]
})
export class AnamnesisModule { }
