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
    // Récupération des utilisateurs de la base
    this.users = firestore.collection('users').valueChanges({ idField: 'userId' });
  }

  /**
   * Renvoie tous les utilisateurs
   */
  getUsers() {
    return this.users;
  }

  /**
   * Créer un utilisateur et l'ajoute à la base de données
   * @param user Utilisateur créé
   */
  add(user) {
    this.fireAuth.createUserWithEmailAndPassword(user.email, user.mdp).then((addedUser) => {
      this.firestore.collection('users').doc(addedUser.user.uid).set({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        nom_utilisateur: user.nom_utilisateur,
        naissance: user.naissance,
        adresse: user.adresse,
        ville: user.ville,
        cp: user.cp
      });
    });
  }

  /**
   * Récupération de la discussion entre deux utilisateurs
   * @param utilisateur1 Identifiant du premier utilisateur
   * @param utilisateur2 Identifiant du second
   */
  getDiscuss(utilisateur1, utilisateur2) {
    return this.firestore.collection('Messages').valueChanges({ idField: 'messageId' });
  }

  /**
   * Envoie d'un message
   * @param msg Message envoyé
   */
  sendMessage(msg) {
    return this.firestore.collection('Messages').add({
      expediteur_id: msg.expediteur_id,
      recepteur_id: msg.recepteur_id,
      date_envoie: '',
      message: msg.message
    });
  }

  /**
   * Vérification de l'identité
   * @param user Utilisateur à vérifier
   */
  async checkAuth(user) {
    return await this.fireAuth.signInWithEmailAndPassword(user.id, user.mdp)
      .then((userCredential) => {
        return userCredential.user.uid;
      })
      .catch((error) => {
        return error.code;
      });
  }

  /**
   * Déconnexion de l'app
   */
  logOut() {
    this.fireAuth.signOut();
  }
}
