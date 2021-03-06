import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IUser } from '@models/user';

const USERS_COLLECTION = 'usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private userCollection!: AngularFirestoreCollection<IUser>;
  private userDoc!: AngularFirestoreDocument<IUser>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.userCollection = afs.collection(USERS_COLLECTION);
  }

  getAllUsers(showDisabled: boolean): Observable<IUser[]> {
    if (showDisabled) {
      this.userCollection = this.afs.collection<IUser>(
        USERS_COLLECTION,
        ref => ref.orderBy('surname')
                  .orderBy('name')
      );
    } else {
      this.userCollection = this.afs.collection<IUser>(
        USERS_COLLECTION,
        ref => ref.where('active', '==', true)
                  .orderBy('surname')
                  .orderBy('name')
      );
    }

    return this.userCollection.valueChanges()
      .pipe(
        map((users) => users.map(
          user => ({ ...user })))
      );
  }

  getOneUser(uidUser: string): Observable<IUser | undefined> {
    return this.userCollection.doc(uidUser)
      .valueChanges({ uidField: 'uid' })
      .pipe(
        map(user => ({ ...user }))
      );
  }

  // TODO When creating, perhaps existing as authenticated (check email)
  addUser(user: IUser): string {
    console.log(`addUser!`);
    const uidUser = this.afs.createId();
    user.uid = uidUser;
    this.userCollection.doc(user.uid).set(user);
    return uidUser;
  }

  updateUser(user: IUser): void {
    const uidUser = user.uid;
    console.log(`update User: ${JSON.stringify(user)}`);
    this.userDoc = this.afs.doc<IUser>(`${USERS_COLLECTION}/${uidUser}`);
    this.userDoc.update(user);
  }

  enableUser(user: IUser, active: boolean): void {
    const uidUser = user.uid;
    user.active = active;
    this.userDoc = this.afs.doc<IUser>(`${USERS_COLLECTION}/${uidUser}`);
    this.userDoc.update(user);
  }

  removeUser(user: IUser): void {
    const uidUser = user.uid;
    this.userDoc = this.afs.doc<IUser>(`${USERS_COLLECTION}/${uidUser}`);
    this.userDoc.delete();
  }

  updateUserData(user: any): Promise<any> {
    const userRef: AngularFirestoreDocument<IUser> = this.afs.doc(
      `${USERS_COLLECTION}/${user.uid}`
    );

    // console.log(`updateUserData 1: ${JSON.stringify(user)}`);

    // TODO: if role exists (or entities), don't update!
    const data: IUser = {
      uid: user.uid,
      active: user.active ?? true,
      name: user.name,
      surname: user.surname,
      email: user.email,
      telephone: user.telephone,
      address: user.address,
      locality: user.locality,
      birthdate: user.birthdate,
      occupation: user.occupation,
      notes: user.notes,
    };

    // console.log(`updateUserData 2: ${JSON.stringify(data)}`);

    return userRef.set(data, { merge: true });
  }
}
