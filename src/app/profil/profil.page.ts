import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  user: any;
  dateNaissance: any;
  age: any;

  constructor(
    public modalController: ModalController,
    public firebase: FirebaseService,
    public storage: Storage
  ) { }

  ngOnInit() {
    // Récupération identifiant utilisateur et du document associé
    this.storage.get('user_id').then((id) => {
      this.firebase.getCurrentUser(id).then(doc => {
        if (doc.exists) {
          this.user = doc.data();
          const date = new Date(Date.parse(this.user.naissance));
          this.dateNaissance = ('0' + date.getDate()).slice(-2) + '/'
            + ('0' + (date.getMonth() + 1)).slice(-2) + '/'
            + date.getFullYear();
          this.age = this.getAge(this.user.naissance);
        }
      });
    });
  }

  /**
   * Retourne l'âge en fonction de la date de naissance
   * @param dateOfBirth Date de naissance
   */
  getAge(naissance: any): number {
    // Aujourd'hui
    const today = new Date();

    // Date de naissance
    const birthDate = new Date(naissance);

    // Différence des années
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    // Au cas ou la différence des mois, une année de différence
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Retour à la page principale
   */
  dismiss() {
    this.modalController.dismiss();
  }

}
