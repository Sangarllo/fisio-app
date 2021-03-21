import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IAnamnesisItem } from '@app/shared/models/anamnesis-item';

const ANAMNESIS_COLLECTION = 'anamnesis';

@Injectable({
  providedIn: 'root'
})
export class AnamnesisService {

  private anamnesisCollection!: AngularFirestoreCollection<IAnamnesisItem>;
  private anamnesisDoc!: AngularFirestoreDocument<IAnamnesisItem>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.anamnesisCollection = afs.collection(ANAMNESIS_COLLECTION);
  }

  getAllAnamnesisFromUser(userId: string): Observable<IAnamnesisItem[]> {
    this.anamnesisCollection = this.afs.collection<IAnamnesisItem>(
      ANAMNESIS_COLLECTION,
      ref => ref.where('userId', '==', userId)
                .orderBy('date')
    );

    return this.anamnesisCollection.valueChanges()
      .pipe(
        map((anamnesis) => anamnesis.map(
          anamnesisItem => ({ ...anamnesisItem })))
      );
  }

  getAllAnamnesis(): Observable<IAnamnesisItem[]> {
    this.anamnesisCollection = this.afs.collection<IAnamnesisItem>(
      ANAMNESIS_COLLECTION,
      ref => ref.orderBy('date')
    );

    return this.anamnesisCollection.valueChanges()
      .pipe(
        map((anamnesis) => anamnesis.map(
          anamnesisItem => ({ ...anamnesisItem })))
      );
  }

  getOneAnamnesisItem(id: string): Observable<IAnamnesisItem | undefined> {
    return this.anamnesisCollection.doc(id)
      .valueChanges({ uidField: 'id' })
      .pipe(
        map(anamnesisItem => ({ ...anamnesisItem }))
      );
  }

  // TODO When creating, perhaps existing as authenticated (check email)
  addAnamnesisItem(anamnesisItem: IAnamnesisItem): string {
    const id = this.afs.createId();
    anamnesisItem.id = id;
    this.anamnesisCollection.doc(anamnesisItem.id).set(anamnesisItem);
    return id;
  }

  updateAnamnesisItem(anamnesisItem: IAnamnesisItem): void {
    const id = anamnesisItem.id;
    this.anamnesisDoc = this.afs.doc<IAnamnesisItem>(`${ANAMNESIS_COLLECTION}/${id}`);
    this.anamnesisDoc.update(anamnesisItem);
  }


  enableAnamnesisItem(anamnesisItem: IAnamnesisItem, enable: boolean): void {
    anamnesisItem.active = enable;
    const id = anamnesisItem.id;
    this.anamnesisDoc = this.afs.doc<IAnamnesisItem>(`${ANAMNESIS_COLLECTION}/${id}`);
    this.anamnesisDoc.update(anamnesisItem);
  }

  removeAnamnesisItem(anamnesisItem: IAnamnesisItem): void {
    const id = anamnesisItem.id;
    this.anamnesisDoc = this.afs.doc<IAnamnesisItem>(`${ANAMNESIS_COLLECTION}/${id}`);
    this.anamnesisDoc.delete();
  }
}
