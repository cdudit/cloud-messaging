import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { Storage } from '@ionic/storage';
import { combineLatest } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.page.html',
  styleUrls: ['./discussion.page.scss'],
})
export class DiscussionPage implements OnInit {
  utilisateur: string;
  form: FormGroup;
  receiverId: string;
  messages: any;
  expediteurId: string;
  urlPhoto: String;

  constructor(
    public afStorage: AngularFireStorage,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    public firebase: FirebaseService,
    public storage: Storage,
    public alert: AlertController
  ) {
    // Création du formulaire
    this.form = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Récupération des deux utilisateurs
    this.utilisateur = this.route.snapshot.paramMap.get('nom_utilisateur');
    this.receiverId = this.route.snapshot.paramMap.get('userId');
    this.storage.get('userId').then(val => {
      this.expediteurId = val;

      // Récupération de la discussion
      this.firebase.getDiscuss(this.receiverId, this.expediteurId).then(value => {

        // On combine les résultats
        combineLatest([value[0], value[1]]).subscribe(data => {

          // On ordonne par date d'envoie
          this.messages = data[0].concat(data[1]).sort((a: any, b: any) => {
            const aDate = new Date(Date.parse(a.date_envoie))
            const bDate = new Date(Date.parse(b.date_envoie))
            return (aDate > bDate ? 1 : (aDate < bDate ? -1 : 0))
          })
        })
      })
      this.afStorage.ref('image_app/' + this.route.snapshot.paramMap.get('photo')).getDownloadURL().subscribe(val => {
        this.urlPhoto = val
      })
    });
  }

  /**
   * Affiche la photo dans une popup
   */
  async displayPhoto() {
    const alert = await this.alert.create({
      message: `<img src="${this.urlPhoto}" alt="photo-profil">`,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        }
      ],
    });
    await alert.present();
  }

  /**
   * Envoi d'un message
   */
  submit() {
    // Si la textarea contient un message
    if (this.form.value.message !== '' && this.form.value.message !== null && this.form.value.message !== undefined) {
      this.firebase.sendMessage({
        expediteur_id: this.expediteurId,
        recepteur_id: this.receiverId,
        date_envoie: '',
        message: this.form.value.message
      }).then(() => this.form.reset());
    }
  }
}
