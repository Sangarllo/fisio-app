import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { SessionsService } from '@services/session.service';
import { ISession } from '@models/session';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {

  public sessions$: Observable<ISession[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionsSrv: SessionsService,
  ) {
  }

  ngOnInit(): void {
    this.sessions$ = this.sessionsSrv.getAllSessions();
  }

  public gotoSession(session: ISession): void {
    this.router.navigate([`usuarios/${session.userId}/consultas/${session.id}`]);
  }

  public editSession(session: ISession): void {
    this.router.navigate([`usuarios/${session.userId}/consultas/${session.id}/editar`]);
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
