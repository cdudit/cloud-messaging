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
    // Récupération identifiant utilisateur et document associé
    this.storage.get('user_id').then((id) => {
      this.firebase.getCurrentUser(id).then(doc => {
        if (doc.exists) {
          this.user = doc.data();
          const date = new Date(Date.parse(this.user.naissance));
          this.dateNaissance = ('0' + date.getDate()).slice(-2) + '/'
            + ('0' + (date.getMonth() + 1)).slice(-2) + '/'
            + date.getFullYear();
          this.age = this.ageFromDateOfBirthday(this.user.naissance);
        }
      });
    });
  }

  public ageFromDateOfBirthday(dateOfBirth: any): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
