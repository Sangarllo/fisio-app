import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SessionsComponent } from './sessions.component';
import { SessionEditComponent } from '../users/session-edit/session-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SessionsComponent
  },
  {
    path: ':uid/editar',
    component: SessionEditComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionsRoutingModule { }
