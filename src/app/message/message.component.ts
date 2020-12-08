import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message: any;
  @Input() discussWith: any;
  wantToSeeDate = false;
  isExpediteur = false;
  isRecepteur = false;
  dateEnvoie: string;

  constructor(public storage: Storage) { }

  ngOnInit() {
    this.storage.get('user_id').then(currentUser => {
      if (this.message.expediteur_id === currentUser && this.message.recepteur_id === this.discussWith) {
        this.isExpediteur = true;
      }
      if (this.message.expediteur_id === this.discussWith && this.message.recepteur_id === currentUser) {
        this.isRecepteur = true;
      }
    });
    const date = new Date(Date.parse(this.message.date_envoie));

    this.dateEnvoie = ('0' + date.getDate()).slice(-2) + '/'
      + ('0' + (date.getMonth() + 1)).slice(-2) + '/'
      + date.getFullYear() + ' '
      + date.getHours() + 'h'
      + ('0' + (date.getMinutes() + 1)).slice(-2);
  }

  displayDate() {
    this.wantToSeeDate = !this.wantToSeeDate;
  }

}
