import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.scss'],
})
export class ContactCardComponent implements OnInit {
  @Input() user: any;
  itsMe = false;

  constructor(public storage: Storage) { }

  ngOnInit() {
    this.storage.get('user_id').then(val => {
      if (this.user.userId === val) {
        this.itsMe = true;
      }
    });
  }

}
