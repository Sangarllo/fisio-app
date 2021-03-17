import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ISession } from '@models/session';

const SESSIONS_COLLECTION = 'consultas';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  private sessionCollection!: AngularFirestoreCollection<ISession>;
  private sessionDoc!: AngularFirestoreDocument<ISession>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.sessionCollection = afs.collection(SESSIONS_COLLECTION);
  }

  getAllSessionsFromUser(userId: string): Observable<ISession[]> {
    this.sessionCollection = this.afs.collection<ISession>(
      SESSIONS_COLLECTION,
      ref => ref.where('userId', '==', userId)
                .orderBy('date')
    );

    return this.sessionCollection.valueChanges()
      .pipe(
        map((sessions) => sessions.map(
          session => {
            return { ...session };
          }))
      );
  }

  getAllSessions(): Observable<ISession[]> {
    this.sessionCollection = this.afs.collection<ISession>(
      SESSIONS_COLLECTION,
      ref => ref.orderBy('date')
    );

    return this.sessionCollection.valueChanges()
      .pipe(
        map((sessions) => sessions.map(
          session => {
            return { ...session };
          }))
      );
  }

  getOneSession(idSession: string): Observable<ISession | undefined> {
    return this.sessionCollection.doc(idSession)
      .valueChanges({ uidField: 'id' })
      .pipe(
        map(session => {
          return { ...session };
        })
      );
  }

  // TODO When creating, perhaps existing as authenticated (check email)
  addSession(session: ISession): void {
    console.log(`addUser!`);
    const idSession = this.afs.createId();
    session.id = idSession;
    this.sessionCollection.doc(session.id).set(session);
  }

  updateSession(session: ISession): void {
    const idSession = session.id;
    this.sessionDoc = this.afs.doc<ISession>(`${SESSIONS_COLLECTION}/${idSession}`);
    this.sessionDoc.update(session);
  }

  deleteSession(session: ISession): void {
    const idSession = session.id;
    session.active = false;
    this.sessionDoc = this.afs.doc<ISession>(`${SESSIONS_COLLECTION}/${idSession}`);
    this.sessionDoc.update(session);
  }
}
