import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.page.html',
  styleUrls: ['./subscribe.page.scss'],
})
export class SubscribePage implements OnInit {
  form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      nom_utilisateur: ['', Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      mdp: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      confirm_mdp: ['', Validators.required],
      naissance: ['', Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      cp: ['', Validators.compose([Validators.pattern('[0-9]{5}'), Validators.required])]
    });
  }

  submit() {
    this.firebaseService.add(this.form.value);
    this.router.navigate(['home']);
  }

  test($event) {
    console.log($event);
  }
}
