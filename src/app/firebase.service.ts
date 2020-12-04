import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  users: Observable<any[]>;

  constructor(
    public firestore: AngularFirestore
  ) {
    this.users = firestore.collection('users').valueChanges();
  }

  getUsers() {
    return this.users;
  }

  add(user) {
    this.firestore.collection('users').add({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      nom_utilisateur: user.nom_utilisateur,
      naissance: user.naissance,
      adresse: user.adresse,
      ville: user.ville,
      cp: user.cp
    });
  }
}
