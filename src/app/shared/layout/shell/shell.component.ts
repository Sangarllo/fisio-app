import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {


  constructor(
    private router: Router,
    public afAuth: AngularFireAuth) {
  }

  async onLogout(): Promise<void> {
    try {
      const currentUser = await this.afAuth.currentUser;
      await this.afAuth.signOut();
      this.router.navigate(['/usuarios/login']);
    } catch (error) {
      console.warn(error);
    }
  }
}
