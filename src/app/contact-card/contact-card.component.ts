import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Storage } from '@ionic/storage';
import { FirebaseService } from '../firebase.service';
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.scss'],
})
export class ContactCardComponent implements OnInit {
  @Input() user: any;
  lastMessage: object;
  urlPhoto: string;

  constructor(
    public afStorage: AngularFireStorage,
    public storage: Storage,
    public firebase: FirebaseService
  ) { }

  ngOnInit(): void {
    this.afStorage.ref('image_app/' + this.user.photo).getDownloadURL().subscribe(val => {
      this.urlPhoto = val;
    });
    this.storage.get('userId').then((val: string) => {
      // Récupération des messages entre deux utilisateurs
      this.firebase.getDiscuss(val, this.user.userId).then(value => {

        // On combine les résultats
        combineLatest([value[0], value[1]]).subscribe(data => {

          // On récupère le dernier
          this.lastMessage = data[0].concat(data[1]).sort((a: any, b: any) => {
            const aDate = new Date(Date.parse(a.date_envoie));
            const bDate = new Date(Date.parse(b.date_envoie));
            return (aDate < bDate ? 1 : (aDate > bDate ? -1 : 0));
          })[0];
        });
      });
    });
  }
}
