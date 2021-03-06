/* eslint-disable max-len */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { SessionsService } from '@services/session.service';
import { ISession, Session } from '@models/session';
import { IUser, User } from '@models/user';
import { AnamnesisItem } from '@models/anamnesis-item';

@Component({
  selector: 'sh-user-sessions-list',
  templateUrl: './user-sessions-list.component.html',
  styleUrls: ['./user-sessions-list.component.scss'],
  providers: [DecimalPipe]
})
export class UserSessionsListComponent {

  @Input() user: IUser;
  public uidUser;
  public sessions: ISession[];
  public sessions$: Observable<ISession[]>;
  filter = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionsSrv: SessionsService,
    pipe: DecimalPipe,
  ) {
    this.uidUser = this.route.snapshot.paramMap.get('uid');
    this.user = this.user;
    console.log(`userId: ${this.uidUser}`);
    this.sessionsSrv.getAllSessionsFromUser(this.uidUser)
    .subscribe( (sessions: ISession[]) => {
      this.sessions = sessions;
      this.sessions$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text, pipe))
    );
    });
  }

  public gotoSession(session: ISession): void {
    this.router.navigate([`${User.PATH_URL}/${this.uidUser}/${AnamnesisItem.PATH_URL}/${session.anamnesisId}/${Session.PATH_URL}/${session.id}`]);
  }

  public editSession(session: ISession): void {
    this.router.navigate([`${User.PATH_URL}/${this.user.uid}/${AnamnesisItem.PATH_URL}/${session.anamnesisId}/${Session.PATH_URL}/${session.id}/editar`]);
  }

  public deleteSession(session: ISession): void {
    console.log(`deleting ${session.id}`);
    Swal.fire({
      title: '??Est??s seguro?',
      text: 'No podr??s deshacer esta acci??n de borrado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '??S??, b??rrala!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sessionsSrv.removeSession(session);
        Swal.fire(
          '??Borrado!',
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

    // || pipe.transform(user.email).includes(term);
  }
}
