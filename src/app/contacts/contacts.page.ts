import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { FirebaseService } from '../firebase.service';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { ProfilPage } from '../profil/profil.page';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  users: Observable<any[]>;

  constructor(
    public firebase: FirebaseService,
    public router: Router,
    public storage: Storage,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    // Récupération des utilisateurs
    this.storage.get('user_email').then(val => {
      this.firebase.getUsers(val).then(value => {
        this.users = value;
      });
    });
  }

  /**
   * Déconnexion de l'app
   */
  logOut() {
    // Déconnexion à partir de fireauth
    this.firebase.logOut();

    // Suppression de l'id dans le storage et redirection
    this.storage.clear().then(() => {
      this.router.navigateByUrl('/');
    });
  }

  /**
   * Affichage des paramètres
   */
  async settings() {
    const modal = await this.modalController.create({
      component: ProfilPage
    });
    return await modal.present();
  }

}
