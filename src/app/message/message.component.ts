import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message: any;
  @Input() recepteurId: any;
  isExpediteur = false;
  isRecepteur = false;

  constructor(public storage: Storage) { }

  ngOnInit() {
    console.log(this.message);
    console.log(this.recepteurId);
    if (this.message.recepteur_id === this.recepteurId) {
      this.isExpediteur = true;
    }
    this.storage.get('user_id').then(val => {
      if (this.message.expediteur_id === val) {
        this.isRecepteur = true;
      }
    });
  }

}
