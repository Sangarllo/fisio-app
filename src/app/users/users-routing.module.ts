import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@app/users/auth.guard';
import { UsersComponent } from '@app/users/users.component';
import { UserViewComponent } from '@app/users/user-view/user-view.component';
import { UserEditComponent } from '@app/users/user-edit/user-edit.component';
import { UserAnamnesisEditComponent } from '@app/users/user-anamnesis-edit/user-anamnesis-edit.component';
import { UserAnamnesisViewComponent } from '@app/users/user-anamnesis-view/user-anamnesis-view.component';
import { UserAnamnesisSessionEditComponent } from '@app/users/user-anamnesis-session-edit/user-anamnesis-session-edit.component';

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
    path: ':uid/anamnesis/:anamnesisId',
    component: UserAnamnesisViewComponent,
  },
  {
    path: ':uid/anamnesis/:anamnesisId/editar',
    component: UserAnamnesisEditComponent,
  },
  {
    path: ':uid/anamnesis/:anamnesisId/sesiones/:sessionId/editar',
    component: UserAnamnesisSessionEditComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
