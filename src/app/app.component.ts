import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  item$: Observable<any[]>;
  constructor(
    public afAuth: AngularFireAuth,
    firestore: AngularFirestore
  ) {
    this.item$ = firestore.collection('items').valueChanges();
  }
}
