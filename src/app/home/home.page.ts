import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  form: FormGroup;
  isLoading = false;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public firebase: FirebaseService,
    public alertController: AlertController,
    public storage: Storage,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: ['', [Validators.email, Validators.required]],
      mdp: ['', [Validators.minLength(6), Validators.required]]
    });
  }

  async submit() {
    this.isLoading = true;
    await this.firebase.checkAuth(this.form.value).then((val) => {
      if (val === 'auth/wrong-password') {
        this.presentAlert('Le mot de passe est incorrect').then(() => this.isLoading = false);
      } else if (val === 'auth/user-not-found') {
        this.presentAlert('Aucun compte trouvé pour l\'adresse mail.').then(() => this.isLoading = false);
      } else {
        this.storage.set('user_id', val);
        this.router.navigate(['contacts']).then(() => this.isLoading = false);
      }
    });
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Erreur',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
