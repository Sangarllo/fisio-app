import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { UsersService } from '@services/user.service';
import { AnamnesisService } from '@services/anamnesis.service';
import { SessionsService } from '@services/session.service';
import { IUser, User } from '@models/user';
import { IAnamnesisItem, AnamnesisItem } from '@models/anamnesis-item';
import { ISession, Session } from '@models/session';

@Component({
  selector: 'app-user-anamnesis-session-edit',
  templateUrl: './user-anamnesis-session-edit.component.html',
  styleUrls: ['./user-anamnesis-session-edit.component.scss']
})
export class UserAnamnesisSessionEditComponent implements OnInit {

  sessionForm!: FormGroup;
  submitted = false;
  pageTitle = 'Nueva sesión';
  btnText = 'Crear';
  errorMessage = '';
  uploadPercent: Observable<number>;

  public user$: Observable<IUser>;
  public anamnesisItem$: Observable<IAnamnesisItem>;
  public session: ISession;
  username: string;

  constructor(
    private afStorage: AngularFireStorage,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usersSrv: UsersService,
    private anamnesisSrv: AnamnesisService,
    private sessionsSrv: SessionsService) { }

  ngOnInit(): void {

    const userUid = this.route.snapshot.paramMap.get('uid');
    if ( userUid ) {
      this.usersSrv.getOneUser(userUid)
        .subscribe(
          (user: IUser) => {
            this.username = `${user.name} ${user.surname}`;
          });
    }

    const anamnesisId = this.route.snapshot.paramMap.get('anamnesisId');
    this.anamnesisItem$ = this.anamnesisSrv.getOneAnamnesisItem(anamnesisId);

    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    if ( sessionId ) {
      console.log(`id asked ${sessionId}`);
      this.getDetails(sessionId, anamnesisId, userUid);
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = today.toISOString().substr(0, 10);

    this.sessionForm = this.fb.group({
      id: [{value: '0', disabled: true}],
      active: true,
      userId: userUid,
      anamnesisId,
      date: [todayStr, Validators.required],
      painRank: [0, Validators.required],
      symptoms: ['', Validators.required],
      treatment: ['', Validators.required],
    });
  }

  public onResetForm(): void {
    this.sessionForm.reset();
  }

  public onSaveForm(): void {

    console.warn(this.sessionForm.value);

    if (this.sessionForm.valid) {

        const sessionItem = {
          ...this.session,
          ...this.sessionForm.value,
          username: this.username
        };

        if (sessionItem.id === '0') {
          this.sessionsSrv.addSession(sessionItem);
        } else {
          this.sessionsSrv.updateSession(sessionItem);
        }

        this.router.navigate([`${User.PATH_URL}/${this.session.userId}/${AnamnesisItem.PATH_URL}/${this.session.anamnesisId}`]);
    } else {
      this.errorMessage = 'Por favor, corrige los mensajes de validación.';
    }
  }

  public onSaveComplete(): void {
    this.sessionForm.reset();
    Swal.fire({
      icon: 'success',
      title: 'Datos guardados con éxito',
      text: `Los datos de esta sesión se han guardado correctamente`,
      // footer: '<a href>Why do I have this issue?</a>'
    });
    this.router.navigate([`/${User.PATH_URL}`]);
  }

  public gotoList(): void {
    this.sessionForm.reset();
    this.router.navigate([`/${User.PATH_URL}`]);
  }

  public gotoUser(): void {
    this.router.navigate([`/${User.PATH_URL}/${this.session.userId}`]);
  }

  public gotoAnamnesisItem(): void {
    this.router.navigate([`/${User.PATH_URL}/${this.session.userId}/${AnamnesisItem.PATH_URL}/${this.session.anamnesisId}`]);
  }

  private getDetails(idSession: string, anamnesisId: string, userUid: string): void {
    console.log(`id asked ${idSession}`);

    if ( idSession === '0' ) {
      this.pageTitle = 'Nueva sesión';
      this.btnText = 'Crear';
      this.session = Session.InitDefault(userUid, anamnesisId);
    } else {
      this.btnText = 'Actualizar';
      this.sessionsSrv.getOneSession(idSession)
      .subscribe({
        next: (session: ISession | undefined) => {
          this.session = session;
          this.displaySession();
        },
        error: err => {
          this.errorMessage = `Error: ${err}`;
        }
      });
    }
  }


  private displaySession(): void {

    if (this.sessionForm) {
      this.sessionForm.reset();
    }

    if (this.session.id === '0') {
      this.pageTitle = 'Nueva sesión';
    } else {
      this.pageTitle = `Edición de sesión`;
    }

    // Update the data on the form
    this.sessionForm.patchValue({
      id: this.session.id,
      active: this.session.active,
      userId: this.session.userId,
      anamnesisId: this.session.anamnesisId,
      date: this.session.date,
      painRank: this.session.painRank,
      symptoms: this.session.symptoms,
      treatment: this.session.treatment,
    });

    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.sessionForm.controls['userId'].setValue(this.session.userId);
    this.sessionForm.controls.id.setValue(this.session.id);
  }


  // convenience getter for easy access to form fields
  get f() { return this.sessionForm.controls; }

}
