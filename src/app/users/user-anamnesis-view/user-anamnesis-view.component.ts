import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { IUser, User } from '@models/user';
import { UsersService } from '@services/user.service';
import { IAnamnesisItem } from '@app/shared/models/anamnesis-item';
import { AnamnesisService } from '@services/anamnesis.service';
import { AnamnesisItem } from '@models/anamnesis-item';
import { Session } from '@models/session';

@Component({
  selector: 'app-user-anamnesis-view',
  templateUrl: './user-anamnesis-view.component.html',
  styleUrls: ['./user-anamnesis-view.component.scss']
})
export class UserAnamnesisViewComponent implements OnInit {

  public user: IUser;
  public anamnesisItem: IAnamnesisItem;
  public uidUser: string;
  public anamnesisId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersSrv: UsersService,
    private anamnesisSrv: AnamnesisService,
  ) { }

  ngOnInit(): void {
    this.uidUser = this.route.snapshot.paramMap.get('uid');
    this.anamnesisId = this.route.snapshot.paramMap.get('anamnesisId');
    if ( this.uidUser && this.anamnesisId ) {
      console.log(`uid asked ${this.uidUser} | id ${this.anamnesisId}`);
      this.getDetails(this.uidUser, this.anamnesisId);
    }
  }

  getDetails(uidUser: string, idAnamnesis: string): void {
    console.log(`uid asked ${uidUser}`);
    this.anamnesisSrv.getOneAnamnesisItem(idAnamnesis)
      .subscribe( (anamnesisItem) => {
        this.anamnesisItem = anamnesisItem;
      });
    this.usersSrv.getOneUser(uidUser)
      .subscribe( (user) => {
        this.user = user;
      });
  }

  public gotoNewSession(): void {
    this.router.navigate([`/${User.PATH_URL}/${this.uidUser}/${AnamnesisItem.PATH_URL}/${this.anamnesisId}/${Session.PATH_URL}/0/editar`]);
  }

  public gotoList(): void {
    this.router.navigate([`/${User.PATH_URL}`]);
  }

  public editUser(): void {
    this.router.navigate([`/${User.PATH_URL}/${this.uidUser}/editar`]);
  }

  public gotoUser(): void {
    this.router.navigate([`/${User.PATH_URL}/${this.uidUser}`]);
  }

  public editAnamnesisItem(): void {
    this.router.navigate([`/${User.PATH_URL}/${this.uidUser}/${AnamnesisItem.PATH_URL}/${this.anamnesisId}/editar`]);
  }
}
