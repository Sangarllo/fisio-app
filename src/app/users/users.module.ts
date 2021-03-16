import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { LoginPageComponent } from '@app/users/login-page/login-page.component';
import { UsersRoutingModule } from '@app/users/users-routing.module';
import { UsersComponent } from '@app/users/users.component';
import { UserViewComponent } from '@app/users/user-view/user-view.component';
import { UserEditComponent } from '@app/users/user-edit/user-edit.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    UsersComponent,
    UserViewComponent,
    UserEditComponent,
  ],
  imports: [
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
