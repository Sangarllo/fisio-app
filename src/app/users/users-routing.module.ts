import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@app/users/auth.guard';
import { LoginPageComponent } from '@app/users/login-page/login-page.component';
import { UsersComponent } from '@app/users/users.component';
import { UserViewComponent } from '@app/users/user-view/user-view.component';
import { UserEditComponent } from '@app/users/user-edit/user-edit.component';
import { SessionEditComponent } from '@app/users/session-edit/session-edit.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginPageComponent
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
    component: SessionEditComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
