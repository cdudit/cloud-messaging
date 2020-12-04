import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebase.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  users: Observable<any[]>;

  constructor(
    public firebase: FirebaseService,
    public router: Router,
    public storage: Storage
  ) { }

  ngOnInit() {
    this.users = this.firebase.getUsers();
  }

  logOut() {
    this.firebase.logOut();
    this.storage.clear().then(() => {
      this.router.navigate(['home']);
    });
  }

}
