import { NgModule } from '@angular/core';

import { LoginRoutingModule } from '@app/login/login-routing.module';
import { LoginComponent } from '@app/login/login.component';
import { EmailLoginComponent } from '@app/login/email-login/email-login.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    LoginComponent,
    EmailLoginComponent,
  ],
  imports: [
    SharedModule,
    LoginRoutingModule,
  ]
})
export class LoginModule { }
