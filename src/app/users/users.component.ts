import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { IUser } from '@models/user';
import { UsersService } from '@services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public loading = true;
  public users: IUser[];

  constructor(
    private router: Router,
    private usersSrv: UsersService,
  ) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.usersSrv.getAllUsers()
    .subscribe( (users: IUser[]) => {
      this.users = users;
      this.loading = false;
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

  public deleteUser(user: IUser): void {
    console.log(`deleting ${user.uid}`);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción de borrado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, bórralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersSrv.deleteUser(user);
        Swal.fire(
          '¡Borrado!',
          `${user.name} ha sido borrado`,
          'success'
        );
      }
    });
  }

  public addItem(): void {
    this.router.navigate([`usuarios/0/editar`]);
  }
}
