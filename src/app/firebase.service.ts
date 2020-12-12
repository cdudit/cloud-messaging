import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject, combineLatest } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

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

  constructor(
    public firestore: AngularFirestore,
    public fireAuth: AngularFireAuth,
    public toastController: ToastController,
    public storage: Storage
  ) {
  }

  /**
   * Renvoie tous les utilisateurs sauf l'utilisateur courant
   * @param notThisEmail email de l'utilisateur connecté
   */
  async getUsers(notThisEmail) {
    return this.firestore.collection('users', ref => ref.where('email', '!=', notThisEmail)).valueChanges({ idField: 'userId' });
  }

  /**
   * Récupération de l'utilisateur connecté
   * @param toFind Identifiant de l'utilisateur en cours
   */
  async getCurrentUser(toFind) {
    return this.firestore.collection('users').doc(toFind).ref.get();
  }

  /**
   * Suppression du message
   * @param id Identifiant du message à supprimer
   */
  deleteMessage(id) {
    return this.firestore.collection('Messages').doc(id).ref.delete();
  }

  /**
   * Mise à jour d'un message envoyé
   * @param id  Identifiant du message
   * @param msg Nouveau message
   */
  updateMessage(id, msg) {
    return this.firestore.collection('Messages').doc(id).ref.update({
      message: msg
    });
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
        cp: user.cp,
        photo: user.photo
      });
    });
  }

  /**
   * Récupération de la discussion entre deux utilisateurs
   * @param id1 Identifiant du premier utilisateur
   * @param id2 Identifiant du second
   */
  async getDiscuss(id1, id2) {
    const expediteur = this.firestore.collection('Messages', ref => ref
      .where('expediteur_id', 'in', [id1, id2]))
      .valueChanges({ idField: 'messageId' })
    const recepteur = this.firestore.collection('Messages', ref => ref
      .where('recepteur_id', 'in', [id1, id2]))
      .valueChanges({ idField: 'messageId' })
    return [expediteur, recepteur]
  }

  /**
   * Envoie d'un message
   * @param msg Message envoyé
   */
  sendMessage(msg) {
    return this.firestore.collection('Messages').add({
      expediteur_id: msg.expediteur_id,
      recepteur_id: msg.recepteur_id,
      date_envoie: new Date().toUTCString(),
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
