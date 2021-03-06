import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(
    public firestore: AngularFirestore,
    public fireAuth: AngularFireAuth,
    public toastController: ToastController,
    public storage: Storage
  ) { }

  /**
   * Renvoie tous les utilisateurs sauf l'utilisateur courant
   * @param myEmail email de l'utilisateur connecté
   */
  async getUsers(myEmail: string): Promise<Observable<{ userId: string; }[]>> {
    return this.firestore.collection('users', ref => ref.where('email', '!=', myEmail)).valueChanges({ idField: 'userId' });
  }

  /**
   * Récupération de l'utilisateur connecté
   * @param toFind Identifiant de l'utilisateur en cours
   */
  async getCurrentUser(toFind: string): Promise<firebase.default.firestore.DocumentSnapshot<unknown>> {
    return this.firestore.collection('users').doc(toFind).ref.get();
  }

  /**
   * Suppression du message
   * @param id Identifiant du message à supprimer
   */
  deleteMessage(id: string): Promise<void> {
    return this.firestore.collection('Messages').doc(id).ref.delete();
  }

  /**
   * Mise à jour d'un message envoyé
   * @param id  Identifiant du message
   * @param msg Nouveau message
   */
  updateMessage(id: string, msg: string): Promise<void> {
    return this.firestore.collection('Messages').doc(id).ref.update({
      message: msg
    });
  }

  /**
   * Créer un utilisateur et l'ajoute à la base de données
   * @param user Utilisateur créé
   */
  add(user): void {
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
  async getDiscuss(id1: string, id2: string) {
    const fromID1toID2 = this.firestore.collection('Messages', ref => ref
      .where('expediteur_id', '==', id1)
      .where('recepteur_id', '==', id2))
      .valueChanges({ idField: 'messageId' });
    const fromID2toID1 = this.firestore.collection('Messages', ref => ref
      .where('expediteur_id', '==', id2)
      .where('recepteur_id', '==', id1))
      .valueChanges({ idField: 'messageId' });
    return [fromID1toID2, fromID2toID1];
  }

  /**
   * Envoie d'un message
   * @param msg Message envoyé
   */
  sendMessage(msg): Promise<DocumentReference<unknown>> {
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
  async checkAuth(user): Promise<firebase.default.auth.UserCredential> {
    return await this.fireAuth.signInWithEmailAndPassword(user.id, user.mdp);
  }

  /**
   * Déconnexion de l'app
   */
  logOut(): void {
    this.fireAuth.signOut();
  }
}
