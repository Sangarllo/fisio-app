import { NgModule } from '@angular/core';

import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionsComponent } from './sessions.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    SessionsComponent,
  ],
  imports: [
    SharedModule,
    SessionsRoutingModule
  ]
})
export class SessionsModule { }
