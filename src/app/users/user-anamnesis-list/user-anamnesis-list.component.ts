/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { AnamnesisService } from '@services/anamnesis.service';
import { IAnamnesisItem } from '@models/anamnesis-item';
import { IUser } from '@models/user';

@Component({
  selector: 'sh-user-anamnesis-list',
  templateUrl: './user-anamnesis-list.component.html',
  styleUrls: ['./user-anamnesis-list.component.scss'],
})
export class UserAnamnesisListComponent {

  @Input() user: IUser;
  public uidUser;
  public anamnesis: IAnamnesisItem[];
  public anamnesis$: Observable<IAnamnesisItem[]>;
  filter = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private anamnesisSrv: AnamnesisService
  ) {
    this.uidUser = this.route.snapshot.paramMap.get('uid');
    this.user = this.user;
    console.log(`userId: ${this.uidUser}`);
    this.anamnesisSrv.getAllAnamnesisFromUser(this.uidUser)
    .subscribe( (anamnesis: IAnamnesisItem[]) => {
      this.anamnesis = anamnesis;
      this.anamnesis$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text))
    );
    });
  }

  public gotoNewAnamnesisItem(): void {
    this.router.navigate([`usuarios/${this.uidUser}/anamnesis/0/editar`]);
  }

  public gotoAnamnesisItem(anamnesisItem: IAnamnesisItem): void {
    this.router.navigate([`usuarios/${this.uidUser}/anamnesis/${anamnesisItem.id}`]);
  }

  public editAnamnesisItem(anamnesisItem: IAnamnesisItem): void {
    this.router.navigate([`usuarios/${this.uidUser}/anamnesis/${anamnesisItem.id}/editar`]);
  }

  public removeAnamnesisItem(anamnesisItem: IAnamnesisItem): void {
    console.log(`deleting ${anamnesisItem.id}`);
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
        this.anamnesisSrv.removeAnamnesisItem(anamnesisItem);
        Swal.fire(
          '¡Borrada!',
          `Esta anamnesis ha sido borrada`,
          'success'
        );
      }
    });
  }

  private search(text: string): IAnamnesisItem[] {
    return this.anamnesis.filter(anamnesisItem => {
      const term = text.toLowerCase();
      return anamnesisItem.reason.toLowerCase().includes(term)
        || anamnesisItem.diagnosis.toLowerCase().includes(term)
        || anamnesisItem.background.toLowerCase().includes(term);
    });
  }
}
