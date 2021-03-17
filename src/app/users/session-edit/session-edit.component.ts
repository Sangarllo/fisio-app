import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { IUser, User } from '@models/user';
import { ISession, Session } from '@models/session';
import { UsersService } from '@services/user.service';
import { SessionsService } from '@services/session.service';

@Component({
  selector: 'app-session-edit',
  templateUrl: './session-edit.component.html',
  styleUrls: ['./session-edit.component.scss']
})
export class SessionEditComponent implements OnInit {

  sessionForm!: FormGroup;
  submitted = false;
  pageTitle = 'Creación de una consulta';
  btnText = 'Crear';
  errorMessage = '';
  uploadPercent: Observable<number>;
  user$: Observable<IUser>;

  public uidUser: string;
  public user!: IUser | undefined;
  public session!: ISession | undefined;

  constructor(
    private afStorage: AngularFireStorage,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usersSrv: UsersService,
    private sessionsSrv: SessionsService) { }

  ngOnInit(): void {

    const idSession = this.route.snapshot.paramMap.get('sessionId');
    this.uidUser = this.route.snapshot.paramMap.get('uid');
    if ( idSession ) {
      console.log(`id asked ${idSession}`);
      console.log(`uid asked ${this.uidUser}`);
      if ( this.uidUser ) {
        this.user$ = this.usersSrv.getOneUser(this.uidUser);
        this.getDetails(idSession, this.uidUser);
      }
    }

    this.sessionForm = this.fb.group({
      id: [{value: '0', disabled: true}],
      active: true,
      userId: this.uidUser,
      date: ['', Validators.required],
      symptoms: ['', Validators.required]
    });
  }

  public onResetForm(): void {
    this.sessionForm.reset();
  }

  public onSaveForm(): void {

    console.warn(this.sessionForm.value);

    if (this.sessionForm.valid) {

        const sessionItem = { ...this.session, ...this.sessionForm.value };

        if (sessionItem.id === '0') {
          this.sessionsSrv.addSession(sessionItem);
        } else {
          this.sessionsSrv.updateSession(sessionItem);
        }

        this.router.navigate([ User.PATH_URL]);

    } else {
      this.errorMessage = 'Por favor, corrige los mensajes de validación.';
    }
  }

 public onSaveComplete(): void {
   // Reset the form to clear the flags
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

  private getDetails(idSession: string, uidUser: string): void {
    console.log(`id asked ${idSession}`);

    if ( idSession === '0' ) {
      this.pageTitle = 'Creación de una nueva consulta';
      this.btnText = 'Crear nueva';
      this.session = Session.InitDefault(uidUser);
    } else {
      this.btnText = 'Actualizar datos';
      this.sessionsSrv.getOneSession(idSession)
      .subscribe({
        next: (session: ISession | undefined) => {
          this.session = session;
          this.displaySession();
          console.log(JSON.stringify(this.user));
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
      this.pageTitle = 'Creando una nueva consulta';
    } else {
      this.pageTitle = `Editando los datos de esta consulta`;
    }

    // Update the data on the form
    this.sessionForm.patchValue({
      id: this.session.id,
      active: this.session.active,
      userId: this.session.userId,
      date: this.session.date,
      symptoms: this.session.symptoms,
    });

    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.sessionForm.controls['userId'].setValue(this.session.userId)
    this.sessionForm.controls['id'].setValue(this.session.id);
  }


  // convenience getter for easy access to form fields
  get f() { return this.sessionForm.controls; }

}
