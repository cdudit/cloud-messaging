import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
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
  urlPhoto;

  constructor(
    public afStorage: AngularFireStorage,
    public storage: Storage,
    public firebase: FirebaseService
  ) { }

  ngOnInit() {
    this.afStorage.ref('image_app/' + this.user.photo).getDownloadURL().subscribe(val => {
      this.urlPhoto = val
    })
  }

}
