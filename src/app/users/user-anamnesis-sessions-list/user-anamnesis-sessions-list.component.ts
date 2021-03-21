/* eslint-disable max-len */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { SessionsService } from '@services/session.service';
import { ISession, Session } from '@models/session';
import { IUser, User } from '@models/user';
import { AnamnesisItem, IAnamnesisItem } from '@models/anamnesis-item';

@Component({
  selector: 'sh-user-anamnesis-sessions-list',
  templateUrl: './user-anamnesis-sessions-list.component.html',
  styleUrls: ['./user-anamnesis-sessions-list.component.scss']
})
export class UserAnamnesisSessionsListComponent implements OnInit {

  @Input() user: IUser = null;
  @Input() anamnesisItem: IAnamnesisItem = null;
  public sessions: ISession[];
  public sessions$: Observable<ISession[]>;
  filter = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionsSrv: SessionsService
  ) {
  }

  ngOnInit(): void {
    this.sessionsSrv.getAllSessionsFromUserAndAnamnesis(this.user?.uid, this.anamnesisItem?.id)
    .subscribe( (sessions: ISession[]) => {
      this.sessions = sessions;
      this.sessions$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text))
    );
    });
  }


  public gotoNewSession(): void {
    // eslint-disable-next-line max-len
    this.router.navigate([`${User.PATH_URL}/${this.user.uid}/${AnamnesisItem.PATH_URL}/${this.anamnesisItem.id}/${Session.PATH_URL}/0/editar`]);
  }

  public editSession(session: ISession): void {
    this.router.navigate([`${User.PATH_URL}/${this.user.uid}/${AnamnesisItem.PATH_URL}/${this.anamnesisItem.id}//${Session.PATH_URL}/${session.id}/editar`]);
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
        this.sessionsSrv.enableSession(session, false);
        Swal.fire(
          '¡Borrada!',
          `Esta sesión ha sido borrada`,
          'success'
        );
      }
    });
  }

  private search(text: string): ISession[] {
    return this.sessions.filter(session => {
      const term = text.toLowerCase();
      return session.date.toLowerCase().includes(term)
      || session.symptoms.toLowerCase().includes(term)
      || session.treatment.toLowerCase().includes(term);
    });
  }
}
