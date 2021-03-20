import { Component, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { SessionsService } from '@services/session.service';
import { ISession } from '@models/session';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  providers: [DecimalPipe]
})
export class SessionsComponent {

  public sessions: ISession[];
  public sessions$: Observable<ISession[]>;
  filter = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionsSrv: SessionsService,
    pipe: DecimalPipe,
  ) {
    this.sessionsSrv.getAllSessions()
    .subscribe( (sessions: ISession[]) => {
      this.sessions = sessions;
      this.sessions$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text, pipe))
    );
    });
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

  private search(text: string, pipe: PipeTransform): ISession[] {
    return this.sessions.filter(session => {
      const term = text.toLowerCase();
      return session.date.toLowerCase().includes(term)
          || session.symptoms.toLowerCase().includes(term);
    });
  }
}
