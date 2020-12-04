import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public firebase: FirebaseService,
    public alertController: AlertController
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: ['', Validators.compose([Validators.email, Validators.required])],
      mdp: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  async submit() {
    await this.firebase.checkAuth(this.form.value).then((val) => {
      if (val === 'auth/wrong-password') {
        this.presentAlert('Le mot de passe est incorrect');
      } else if (val === 'auth/user-not-found') {
        this.presentAlert('Aucun compte trouvé pour l\'adresse mail.');
      } else {
        this.router.navigate(['contacts']);
      }
      console.log(val);
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
