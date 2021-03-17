import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { SessionsService } from '@services/session.service';
import { ISession } from '@models/session';

@Component({
  selector: 'sh-sessions-list',
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.scss']
})
export class SessionsListComponent implements OnInit {

  public uidUser;
  public sessions$: Observable<ISession[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionsSrv: SessionsService,
  ) {
  }

  ngOnInit(): void {
    this.uidUser = this.route.snapshot.paramMap.get('uid');
    console.log(`userId: ${this.uidUser}`);
    this.sessions$ = this.sessionsSrv.getAllSessionsFromUser(this.uidUser);
  }

  public gotoNewSession(): void {
    this.router.navigate([`usuarios/${this.uidUser}/consultas/0/editar`]);
  }


  public gotoSession(session: ISession): void {
    this.router.navigate([`usuarios/${this.uidUser}/consultas/${session.id}`]);
  }

  public editSession(session: ISession): void {
    this.router.navigate([`usuarios/${this.uidUser}/consultas/${session.id}/editar`]);
  }

  public deleteSession(session: ISession): void {
    console.log(`deleting ${session.id}`);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción de borrado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, bórrala!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sessionsSrv.deleteSession(session);
        Swal.fire(
          '¡Borrado!',
          `${session.id} ha sido borrado`,
          'success'
        );
      }
    });
  }
}
