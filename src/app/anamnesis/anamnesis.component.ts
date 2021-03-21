/* eslint-disable @typescript-eslint/member-ordering */
import { Component, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { AnamnesisItem, IAnamnesisItem } from '@models/anamnesis-item';
import { AnamnesisService } from '@services/anamnesis.service';
import { User } from '@models/user';

@Component({
  selector: 'app-anamnesis',
  templateUrl: './anamnesis.component.html',
  styleUrls: ['./anamnesis.component.scss']
})
export class AnamnesisComponent {

  public anamnesis: IAnamnesisItem[];
  public showDisabled = false;
  anamnesis$: Observable<IAnamnesisItem[]>;
  filter = new FormControl('');

  constructor(
    private router: Router,
    private anamnesisSrv: AnamnesisService
  ) {
    this.refreshAnamnesis();
  }

  private refreshAnamnesis(): void {
    this.anamnesisSrv.getAllAnamnesis()
    .subscribe( (anamnesis: IAnamnesisItem[]) => {
      this.anamnesis = anamnesis;
      this.anamnesis$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text))
    );
    });
  }

  public gotoAnamnesisItem(anamnesisItem: IAnamnesisItem): void {
    this.router.navigate([`${User.PATH_URL}/${anamnesisItem.userId}/${AnamnesisItem.PATH_URL}/${anamnesisItem.id}`]);
  }

  public editAnamnesisItem(anamnesisItem: IAnamnesisItem): void {
    this.router.navigate([`${User.PATH_URL}/${anamnesisItem.userId}/${AnamnesisItem.PATH_URL}/${anamnesisItem.id}/editar`]);
  }

  public disableUser(anamnesisItem: IAnamnesisItem): void {
    console.log(`deleting ${anamnesisItem.id}`);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Eliminación lógica',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.anamnesisSrv.enableAnamnesisItem(anamnesisItem, false);
        Swal.fire(
          '¡Deshabilitado!',
          `${anamnesisItem.diagnosis} ha sido eliminado`,
          'success'
        );
      }
    });
  }

  public enableAnamnesisItem(anamnesisItem: IAnamnesisItem): void {
    console.log(`enabling ${anamnesisItem.id}`);
    this.anamnesisSrv.enableAnamnesisItem(anamnesisItem, true);
  }

  private search(text: string): IAnamnesisItem[] {
    return this.anamnesis.filter(anamnesisItem => {
      const term = text.toLowerCase();
      return anamnesisItem.diagnosis.toLowerCase().includes(term)
          || anamnesisItem.background.toLowerCase().includes(term)
          || anamnesisItem.performance.toLowerCase().includes(term);
    });
  }
}
