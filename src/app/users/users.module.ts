import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { UsersRoutingModule } from '@app/users/users-routing.module';
import { UsersComponent } from '@app/users/users.component';
import { UserViewComponent } from '@app/users/user-view/user-view.component';
import { UserEditComponent } from '@app/users/user-edit/user-edit.component';
import { UserSessionsListComponent } from '@app/users/user-sessions-list/user-sessions-list.component';
import { UserAnamnesisViewComponent } from '@app/users/user-anamnesis-view/user-anamnesis-view.component';
import { UserAnamnesisEditComponent } from '@app/users/user-anamnesis-edit/user-anamnesis-edit.component';
import { UserAnamnesisListComponent } from '@app/users/user-anamnesis-list/user-anamnesis-list.component';
import { UserAnamnesisSessionsListComponent } from '@app/users/user-anamnesis-sessions-list/user-anamnesis-sessions-list.component';
import { UserAnamnesisSessionEditComponent } from '@app/users/user-anamnesis-session-edit/user-anamnesis-session-edit.component';

@NgModule({
  declarations: [
    UsersComponent,
    UserViewComponent,
    UserEditComponent,
    UserAnamnesisViewComponent,
    UserAnamnesisEditComponent,
    UserAnamnesisListComponent,
    UserAnamnesisSessionsListComponent,
    UserAnamnesisSessionEditComponent,
    UserSessionsListComponent,
  ],
  imports: [
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
