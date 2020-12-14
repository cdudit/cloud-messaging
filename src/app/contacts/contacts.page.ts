import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { FirebaseService } from '../firebase.service';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { ProfilPage } from '../profil/profil.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';

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
    public modalController: ModalController,
    public geolocation: Geolocation
  ) { }

  ngOnInit() {
    // Récupération des utilisateurs
    this.storage.get('userEmail').then(val => {
      this.firebase.getUsers(val).then(value => {
        this.users = value;
      });
    });

    // Récupération de la position de l'utilisateur
    this.geolocation.getCurrentPosition().then((resp) => {
      this.storage.set('lastLocation', resp.coords)
      console.log(resp);
    }).catch((error) => {
      console.log('Error getting location', error);
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
      component: ProfilPage,
      swipeToClose: true
    });
    return await modal.present();
  }

}
