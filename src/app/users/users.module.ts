import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { UsersRoutingModule } from '@app/users/users-routing.module';
import { UsersComponent } from '@app/users/users.component';
import { UserViewComponent } from '@app/users/user-view/user-view.component';
import { UserEditComponent } from '@app/users/user-edit/user-edit.component';
import { UserSessionEditComponent } from '@app/users/user-session-edit/user-session-edit.component';
import { UserSessionsListComponent } from '@app/users/user-sessions-list/user-sessions-list.component';

@NgModule({
  declarations: [
    UsersComponent,
    UserViewComponent,
    UserEditComponent,
    UserSessionEditComponent,
    UserSessionsListComponent,
  ],
  imports: [
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
