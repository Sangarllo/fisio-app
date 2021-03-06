import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/users/auth.guard';
import { HomeComponent } from '@app/home/home.component';
import { Error404Component } from '@shared/components/error404/error404.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'anamnesis',
    loadChildren: () => import('./anamnesis/anamnesis.module').then(m => m.AnamnesisModule)
  },
  {
    path: 'sesiones',
    loadChildren: () => import('./sessions/sessions.module').then(m => m.SessionsModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path        : '**',
    pathMatch   : 'full',
    component   : Error404Component
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
