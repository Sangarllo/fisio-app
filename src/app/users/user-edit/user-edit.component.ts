import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { IUser, User } from '@models/user';
import { UsersService } from '@services/user.service';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  userForm!: FormGroup;
  submitted = false;
  pageTitle = 'Nuevo usuario';
  btnText = 'Crear';
  errorMessage = '';
  uploadPercent: Observable<number>;

  public user!: IUser | undefined;

  constructor(
    private afStorage: AngularFireStorage,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usersSrv: UsersService) { }

  ngOnInit(): void {

    const uidUser = this.route.snapshot.paramMap.get('uid');
    if ( uidUser ) {
      console.log(`uid asked ${uidUser}`);
      this.getDetails(uidUser);
    }

    this.userForm = this.fb.group({
      uid: [{value: '0', disabled: true}],
      active: true,
      email: ['', [
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(50)]],
      telephone: [''],
      name: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]],
      surname: ['', [Validators.required,
        Validators.minLength(3),
         Validators.maxLength(50)]],
      address: [''],
      locality: [''],
      birthdate: [''],
      occupation: [''],
      notes: [''],
    });
  }

  public onResetForm(): void {
    this.userForm.reset();
 }

  public onSaveForm(): void {

    console.warn(this.userForm.value);

    if (this.userForm.valid) {

        const userItem = { ...this.user, ...this.userForm.value };

        if (userItem.uid === '0') {
          this.usersSrv.addUser(userItem);
        } else {
          console.log(`editando`);
          this.usersSrv.updateUser(userItem);
        }

        this.router.navigate([ User.PATH_URL]);

    } else {
      this.errorMessage = 'Por favor, corrige los mensajes de validación.';
    }
  }

 public onSaveComplete(): void {
   // Reset the form to clear the flags
   this.userForm.reset();
   Swal.fire({
     icon: 'success',
     title: 'Datos guardados con éxito',
     text: `Los datos de ${this.user.name} ${this.user.surname} se han guardado correctamente`,
     // footer: '<a href>Why do I have this issue?</a>'
   });
   this.router.navigate([`/${User.PATH_URL}`]);
 }

 public gotoList(): void {
   this.userForm.reset();
   this.router.navigate([`/${User.PATH_URL}`]);
 }

  private getDetails(uidUser: string): void {
    console.log(`uid asked ${uidUser}`);

    if ( uidUser === '0' ) {
      this.pageTitle = 'Nuevo usuario';
      this.btnText = 'Crear';
      this.user = User.InitDefault();
    } else {
      this.btnText = 'Actualizar';
      this.usersSrv.getOneUser(uidUser)
      .subscribe({
        next: (user: IUser | undefined) => {
          this.user = user;
          this.displayUser();
          console.log(JSON.stringify(this.user));
        },
        error: err => {
          this.errorMessage = `Error: ${err}`;
        }
      });
    }
  }


  private displayUser(): void {

    if (this.userForm) {
      this.userForm.reset();
    }

    if (this.user.uid === '0') {
      this.pageTitle = 'Nuevo usuario';
    } else {
      this.pageTitle = `Actualizar datos`;
    }

    // Update the data on the form
    this.userForm.patchValue({
      uid: this.user.uid,
      active: this.user.active,
      email: this.user.email,
      telephone: this.user.telephone,
      name: this.user.name,
      surname: this.user.surname,
      address: this.user.address,
      locality: this.user.locality,
      birthdate: this.user.birthdate,
      occupation: this.user.occupation,
      notes: this.user.notes,
    });

    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.userForm.controls['uid'].setValue(this.user.uid);
  }


  // convenience getter for easy access to form fields
  get f() { return this.userForm.controls; }

}
