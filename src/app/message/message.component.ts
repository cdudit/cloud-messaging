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
  isSender = false;
  isReceiver = false;
  dateEnvoie: string;

  constructor(
    public storage: Storage,
    public firebase: FirebaseService,
    public alertController: AlertController
  ) { }

  ngOnInit(): void {
    // Récupération de l'utilisateur et vérification de qui envoie et qui reçois
    this.storage.get('userId').then((currentUser: string) => {
      if (this.message.expediteur_id === currentUser && this.message.recepteur_id === this.discussWith) {
        this.isSender = true;
      } else {
        this.isReceiver = true;
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
  click(): void {
    this.isClicked = !this.isClicked;
  }

  /**
   * Mise à jour du message avec un nouveau texte
   */
  async update(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Modification du message',
      inputs: [{
        name: 'newMsg',
        type: 'textarea',
        id: 'newMsg',
        value: this.message.message,
      }],
      buttons: [{
        text: 'Annuler',
        role: 'cancel'
      }, {
        text: 'Confirmer',
        handler: (data) => {
          this.firebase.updateMessage(this.message.messageId, data.newMsg);
        }
      }]
    });
    await alert.present();
  }

  /**
   * Suppression du message
   */
  async delete(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Attention',
      message: 'Êtes-vous sûr de vouloir supprimer ce message ?',
      buttons: [{
        text: 'Annuler',
        role: 'cancel'
      }, {
        text: 'Confirmer',
        handler: () => {
          this.firebase.deleteMessage(this.message.messageId);
        }
      }]
    });
    await alert.present();
  }
}
