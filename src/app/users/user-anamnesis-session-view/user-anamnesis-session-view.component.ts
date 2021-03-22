/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { UsersService } from '@services/user.service';
import { AnamnesisService } from '@services/anamnesis.service';
import { SessionsService } from '@services/session.service';
import { AnamnesisItem, IAnamnesisItem } from '@models/anamnesis-item';
import { Session, ISession } from '@models/session';
import { IUser, User } from '@models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-anamnesis-session-view',
  templateUrl: './user-anamnesis-session-view.component.html',
  styleUrls: ['./user-anamnesis-session-view.component.scss']
})
export class UserAnamnesisSessionViewComponent implements OnInit {

  public uidUser: string;
  public user: IUser;
  public anamnesisId: string;
  public anamnesisItem: IAnamnesisItem;
  public sessionId: string;
  public session: ISession;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersSrv: UsersService,
    private anamnesisSrv: AnamnesisService,
    private sessionsSrv: SessionsService,
  ) { }

  ngOnInit(): void {
    this.uidUser = this.route.snapshot.paramMap.get('uid');
    this.anamnesisId = this.route.snapshot.paramMap.get('anamnesisId');
    this.sessionId = this.route.snapshot.paramMap.get('sessionId');
    if ( this.uidUser && this.anamnesisId ) {
      console.log(`uid asked ${this.uidUser} | id ${this.anamnesisId} | id ${this.sessionId}`);
      this.getDetails(this.uidUser, this.anamnesisId, this.sessionId);
    }
  }

  getDetails(uidUser: string, anamnesisId: string, sessionId: string): void {
    this.sessionsSrv.getOneSession(sessionId)
      .subscribe( (session) => {
        this.session = session;
      });

    this.anamnesisSrv.getOneAnamnesisItem(anamnesisId)
      .subscribe( (anamnesisItem) => {
        this.anamnesisItem = anamnesisItem;
      });
    this.usersSrv.getOneUser(uidUser)
      .subscribe( (user) => {
        this.user = user;
      });
  }

  public editUser(): void {
    this.router.navigate([`/${User.PATH_URL}/${this.uidUser}/editar`]);
  }

  public gotoUser(): void {
    this.router.navigate([`/${User.PATH_URL}/${this.uidUser}`]);
  }

  public gotoAnamnesisItem(): void {
    this.router.navigate([`/${User.PATH_URL}/${this.uidUser}/${AnamnesisItem.PATH_URL}/${this.anamnesisId}`]);
  }

  public editAnamnesisItem(): void {
    this.router.navigate([`/${User.PATH_URL}/${this.uidUser}/${AnamnesisItem.PATH_URL}/${this.anamnesisId}/editar`]);
  }

  public editSession(): void {
    this.router.navigate([`/${User.PATH_URL}/${this.uidUser}/${AnamnesisItem.PATH_URL}/${this.anamnesisId}/${Session.PATH_URL}/${this.sessionId}/editar`]);
  }

  public removeSession(): void {
    console.log(`deleting ${this.session.id}`);
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
        this.sessionsSrv.removeSession(this.session);
        Swal.fire(
          '¡Borrada!',
          `Esta sesión ha sido borrada`,
          'success'
        );
        this.gotoAnamnesisItem();
      }
    });
  }
}
