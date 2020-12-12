import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.scss'],
})
export class ContactCardComponent implements OnInit {
  @Input() user: any;
  lastMessage: any = '';

  constructor(
    public storage: Storage,
    public firebase: FirebaseService
  ) { }

  ngOnInit() {
  }

}
