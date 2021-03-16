import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SnackService {
  constructor(
    private router: Router) {
  }

  // eslint-disable-next-line
  authError() {
    Swal.fire(
      '¡Acceso denegado!',
      'Debes acceder como usuario registrado',
      'error'
    );
    this.router.navigate(['/usuarios/login'])
  }
}
