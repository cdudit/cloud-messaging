import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

export interface User {
  nom: string;
  prenom: string;
  nom_utilisateur: string;
  email: string;
  adresse: string;
  ville: string;
  cp: string;
  naissance: string;
}

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  users: Observable<any[]>;

  constructor(
    public firestore: AngularFirestore,
    public fireAuth: AngularFireAuth,
    public toastController: ToastController
  ) {
    this.users = firestore.collection('users').valueChanges({ idField: 'userId' });
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
    this.fireAuth.createUserWithEmailAndPassword(user.email, user.mdp);
  }

  sendMessage(msg) {
    console.log(msg);

    this.firestore.collection('Messages').add({
      expediteur_id: msg.expediteur_id,
      recepteur_id: msg.recepteur_id,
      date_envoie: '',
      message: msg.message
    });
  }

  async checkAuth(user) {
    return await this.fireAuth.signInWithEmailAndPassword(user.id, user.mdp)
      .then((userCredential) => {
        return userCredential.user.uid;
      })
      .catch((error) => {
        return error.code;
      });
  }

  logOut() {
    this.fireAuth.signOut();
  }
}
