import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { File } from '@ionic-native/file/ngx';

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
    // Création du formulaire
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      nom_utilisateur: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      mdp: ['', [Validators.minLength(6), Validators.required]],
      confirm_mdp: ['', Validators.required],
      naissance: ['', Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      cp: ['', [Validators.pattern('[0-9]{5}'), Validators.required]]
    });
  }

  /**
   * Ajout dans la base de données et redirection
   */
  submit() {
    this.firebaseService.add(this.form.value);
    this.router.navigate(['home']);
  }
}
