import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  users: Observable<any[]>;

  constructor(
    public firebase: FirebaseService,
    public router: Router
  ) { }

  ngOnInit() {
    this.users = this.firebase.getUsers();
    console.log(this.users);
  }

  logOut() {
    this.firebase.logOut();
    this.router.navigate(['home']);
  }

}
