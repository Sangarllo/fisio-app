import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { IUser, User } from '@models/user';
import { UsersService } from '@services/user.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {

  public user$: Observable<IUser | undefined> | null = null;
  public uidUser: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersSrv: UsersService,
  ) { }

  ngOnInit(): void {
    this.uidUser = this.route.snapshot.paramMap.get('uid');
    if ( this.uidUser ) {
      console.log(`uid asked ${this.uidUser}`);
      this.getDetails(this.uidUser);
    }
  }

  getDetails(uidUser: string): void {
    console.log(`uid asked ${uidUser}`);
    this.user$ = this.usersSrv.getOneUser(uidUser);
  }

  public gotoList(): void {
    this.router.navigate([`/${User.PATH_URL}`]);
  }

  public editUser(): void {
    this.router.navigate([`/${User.PATH_URL}/${this.uidUser}/editar`]);
  }
}
