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
    // Création du formbuilder
    this.form = this.fb.group({
      id: ['', [Validators.email, Validators.required]],
      mdp: ['', [Validators.minLength(6), Validators.required]]
    });
  }

  /**
   * Tentative de connexion à l'app
   */
  async submit() {
    // Affichage du loader
    this.isLoading = true;

    // Vérification de l'identité et gestion des erreurs
    await this.firebase.checkAuth(this.form.value).then((val) => {
      if (val === 'auth/wrong-password') {
        this.presentAlert('Le mot de passe est incorrect').then(() => this.isLoading = false);
      } else if (val === 'auth/user-not-found') {
        this.presentAlert('Aucun compte trouvé pour l\'adresse mail.').then(() => this.isLoading = false);
      } else {
        // Si identité vérifiée, ajout de l'id dans le storage et redirection
        this.storage.set('user_id', val);
        this.storage.set('user_email', this.form.value.id);
        this.router.navigate(['contacts']).then(() => this.isLoading = false);
      }
    });
  }

  /**
   * Affichage d'un message d'erreur
   * @param msg Message d'erreur
   */
  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Erreur',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
