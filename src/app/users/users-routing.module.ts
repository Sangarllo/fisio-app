import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@app/users/auth.guard';
import { UsersComponent } from '@app/users/users.component';
import { UserViewComponent } from '@app/users/user-view/user-view.component';
import { UserEditComponent } from '@app/users/user-edit/user-edit.component';
import { UserSessionEditComponent } from '@app/users/user-session-edit/user-session-edit.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: ':uid',
    component: UserViewComponent,
  },
  {
    path: ':uid/editar',
    component: UserEditComponent,
  },
  {
    path: ':uid/consultas/:sessionId/editar',
    component: UserSessionEditComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
