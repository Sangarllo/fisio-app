import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { IUser, User } from '@models/user';
import { IAnamnesisItem, AnamnesisItem } from '@models/anamnesis-item';
import { UsersService } from '@services/user.service';
import { AnamnesisService } from '@services/anamnesis.service';

@Component({
  selector: 'app-user-anamnesis-edit',
  templateUrl: './user-anamnesis-edit.component.html',
  styleUrls: ['./user-anamnesis-edit.component.scss']
})
export class UserAnamnesisEditComponent implements OnInit {

  anamnesisForm!: FormGroup;
  submitted = false;
  pageTitle = 'Nueva anamnesis';
  btnText = 'Crear';
  errorMessage = '';
  uploadPercent: Observable<number>;
  username: string;

  public uidUser: string;
  public user!: IUser | undefined;
  public anamnesisItem!: IAnamnesisItem | undefined;

  constructor(
    private afStorage: AngularFireStorage,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usersSrv: UsersService,
    private anamnesisSrv: AnamnesisService) { }

  ngOnInit(): void {

    const idAnamnesis = this.route.snapshot.paramMap.get('anamnesisId');
    this.uidUser = this.route.snapshot.paramMap.get('uid');
    if ( idAnamnesis ) {
      if ( this.uidUser ) {
        this.usersSrv.getOneUser(this.uidUser)
          .subscribe(
            (user: IUser) => {
              this.username = `${user.name} ${user.surname}`;
            });
        this.getDetails(idAnamnesis, this.uidUser);
      }
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = today.toISOString().substr(0, 10);

    this.anamnesisForm = this.fb.group({
      id: [{value: '0', disabled: true}],
      active: true,
      userId: this.uidUser,
      date: [todayStr, Validators.required],
      reason: [''],
      diagnosis: ['', Validators.required],
      background: [''],
      performance: [''],
      notes: ['']
    });
  }

  public onResetForm(): void {
    this.anamnesisForm.reset();
  }

  public onSaveForm(): void {

    console.warn(this.anamnesisForm.value);

    if (this.anamnesisForm.valid) {

        const anamnesisItem = {
          ...this.anamnesisItem,
          ...this.anamnesisForm.value,
          username: this.username
        };

        if (anamnesisItem.id === '0') {
          const newId = this.anamnesisSrv.addAnamnesisItem(anamnesisItem);
          this.router.navigate([ `${User.PATH_URL}/${this.uidUser}/${AnamnesisItem.PATH_URL}/${newId}` ]);

        } else {
          this.anamnesisSrv.updateAnamnesisItem(anamnesisItem);
          this.router.navigate([ `${User.PATH_URL}/${this.uidUser}/${AnamnesisItem.PATH_URL}/${this.anamnesisItem.id}` ]);
        }


    } else {
      this.errorMessage = 'Por favor, corrige los mensajes de validación.';
    }
  }

 public onSaveComplete(): void {
   // Reset the form to clear the flags
   this.anamnesisForm.reset();
   Swal.fire({
     icon: 'success',
     title: 'Datos guardados con éxito',
     text: `Los datos de esta anamnesis se han guardado correctamente`,
     // footer: '<a href>Why do I have this issue?</a>'
   });
   this.router.navigate([`/${User.PATH_URL}`]);
 }

 public gotoList(): void {
   this.anamnesisForm.reset();
   this.router.navigate([`/${User.PATH_URL}`]);
 }

 public gotoUser(): void {
  this.router.navigate([`/${User.PATH_URL}/${this.uidUser}`]);
}

  private getDetails(idAnamnesis: string, uidUser: string): void {
    console.log(`id asked ${idAnamnesis}`);

    if ( idAnamnesis === '0' ) {
      this.pageTitle = 'Nueva anamnesis';
      this.btnText = 'Crear';
      this.anamnesisItem = AnamnesisItem.InitDefault(uidUser);
    } else {
      this.btnText = 'Actualizar';
      this.anamnesisSrv.getOneAnamnesisItem(idAnamnesis)
      .subscribe({
        next: (anamnesisItem: IAnamnesisItem | undefined) => {
          this.anamnesisItem = anamnesisItem;
          this.displayAnamnesis();
          console.log(JSON.stringify(this.user));
        },
        error: err => {
          this.errorMessage = `Error: ${err}`;
        }
      });
    }
  }


  private displayAnamnesis(): void {

    if (this.anamnesisForm) {
      this.anamnesisForm.reset();
    }

    if (this.anamnesisItem.id === '0') {
      this.pageTitle = 'Nueva anamnesis';
    } else {
      this.pageTitle = `Edición de anamnesis`;
    }

    // Update the data on the form
    this.anamnesisForm.patchValue({
      id: this.anamnesisItem.id,
      active: this.anamnesisItem.active,
      userId: this.anamnesisItem.userId,
      date: this.anamnesisItem.date,
      reason: this.anamnesisItem.reason,
      diagnosis: this.anamnesisItem.diagnosis,
      background: this.anamnesisItem.background,
      performance: this.anamnesisItem.performance,
      notes: this.anamnesisItem.notes,
    });

    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.anamnesisForm.controls['userId'].setValue(this.anamnesisItem.userId);
    this.anamnesisForm.controls.id.setValue(this.anamnesisItem.id);
  }


  // convenience getter for easy access to form fields
  get f() { return this.anamnesisForm.controls; }
}
