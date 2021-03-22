/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable max-len */
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { SessionsService } from '@services/session.service';
import { ISession, Session } from '@models/session';
import { User } from '@models/user';
import { AnamnesisItem } from '@models/anamnesis-item';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent {

  public sessions: ISession[];
  public sessions$: Observable<ISession[]>;
  filter = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionsSrv: SessionsService,
  ) {
    this.refreshSession();
  }

  private refreshSession(): void {
    this.sessionsSrv.getAllSessions()
    .subscribe( (sessions: ISession[]) => {
      this.sessions = sessions;
      this.sessions$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text))
    );
    });
  }

  public gotoSession(session: ISession): void {
    this.router.navigate([`${User.PATH_URL}/${session.userId}/${AnamnesisItem.PATH_URL}/${session.anamnesisId}/${Session.PATH_URL}/${session.id}`]);
  }

  public editSession(session: ISession): void {
    this.router.navigate([`${User.PATH_URL}/${session.userId}/${AnamnesisItem.PATH_URL}/${session.anamnesisId}/${Session.PATH_URL}/${session.id}/editar`]);
  }

  private search(text: string): ISession[] {
    return this.sessions.filter(session => {
      const term = text.toLowerCase();
      return session.date.toLowerCase().includes(term)
          || session.symptoms.toLowerCase().includes(term);
    });
  }
}
