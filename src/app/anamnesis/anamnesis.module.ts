import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { AnamnesisRoutingModule } from './anamnesis-routing.module';
import { AnamnesisComponent } from './anamnesis.component';


@NgModule({
  declarations: [AnamnesisComponent],
  imports: [
    SharedModule,
    AnamnesisRoutingModule
  ]
})
export class AnamnesisModule { }
