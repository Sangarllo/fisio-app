import { Component, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { IUser } from '@models/user';
import { UsersService } from '@services/user.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [DecimalPipe]
})
export class UsersComponent {

  public users: IUser[];
  users$: Observable<IUser[]>;
  filter = new FormControl('');

  constructor(
    private router: Router,
    private usersSrv: UsersService,
    pipe: DecimalPipe,
  ) {
    this.usersSrv.getAllUsers()
    .subscribe( (users: IUser[]) => {
      this.users = users;
      this.users$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text, pipe))
    );
    });
  }

  public gotoNewUser(): void {
    this.router.navigate([`usuarios/0/editar`]);
  }


  public gotoUser(user: IUser): void {
    this.router.navigate([`usuarios/${user.uid}`]);
  }

  public editUser(user: IUser): void {
    this.router.navigate([`usuarios/${user.uid}/editar`]);
  }

  public disableUser(user: IUser): void {
    console.log(`deleting ${user.uid}`);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás pasar consulta mientras esté deshabilitado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, deshabilitar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersSrv.enableUser(user, false);
        Swal.fire(
          '¡Deshabilitado!',
          `${user.name} ha sido eliminado`,
          'success'
        );
      }
    });
  }

  public enableUser(user: IUser): void {
    console.log(`enabling ${user.uid}`);
    this.usersSrv.enableUser(user, true);
  }

  private search(text: string, pipe: PipeTransform): IUser[] {
    return this.users.filter(user => {
      const term = text.toLowerCase();
      return user.name.toLowerCase().includes(term)
          || user.surname.toLowerCase().includes(term)
          || user.email.toLowerCase().includes(term);
    });

    // || pipe.transform(user.email).includes(term);
  }

  public addItem(): void {
    this.router.navigate([`usuarios/0/editar`]);
  }
}
