import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message: any;
  @Input() discussWith: any;
  isClicked = false;
  isExpediteur = false;
  isRecepteur = false;
  dateEnvoie: string;

  constructor(
    public storage: Storage,
    public firebase: FirebaseService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.storage.get('user_id').then(currentUser => {
      if (this.message.expediteur_id === currentUser && this.message.recepteur_id === this.discussWith) {
        this.isExpediteur = true;
      }
      if (this.message.expediteur_id === this.discussWith && this.message.recepteur_id === currentUser) {
        this.isRecepteur = true;
      }
    });

    // Refactorisation de la date d'envoie
    const date = new Date(Date.parse(this.message.date_envoie));
    this.dateEnvoie = ('0' + date.getDate()).slice(-2) + '/'
      + ('0' + (date.getMonth() + 1)).slice(-2) + '/'
      + date.getFullYear() + ' '
      + date.getHours() + 'h'
      + ('0' + (date.getMinutes() + 1)).slice(-2);
  }

  /**
   * Click sur le message pour afficher la date et le menu
   */
  click() {
    this.isClicked = !this.isClicked;
  }

  /**
   * Mise à jour du message avec un nouveau texte
   */
  async update() {
    const alert = await this.alertController.create({
      header: 'Modification du message',
      inputs: [
        {
          name: 'newMsg',
          type: 'text',
          id: 'newMsg',
          value: this.message.message,
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        }, {
          text: 'Confirmer',
          handler: (data) => {
            this.firebase.updateMessage(this.message.messageId, data.newMsg);
          }
        }
      ]
    });
    await alert.present();
    console.log(this.message.messageId);
  }

  /**
   * Suppression du message
   */
  async delete() {
    const alert = await this.alertController.create({
      header: 'Attention',
      message: 'Êtes-vous sûr de vouloir supprimer ce message ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        }, {
          text: 'Confirmer',
          handler: () => {
            this.firebase.deleteMessage(this.message.messageId);
          }
        }
      ]
    });
    await alert.present();
  }

}
