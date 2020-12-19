import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Md5 } from 'ts-md5/dist/md5';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.page.html',
  styleUrls: ['./subscribe.page.scss'],
})
export class SubscribePage implements OnInit {
  form: FormGroup;
  hashPhoto: string | Int32Array;
  pcent: Observable<number>;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public firebaseService: FirebaseService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
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
      cp: ['', [Validators.pattern('[0-9]{5}'), Validators.required]],
      photo: ['', Validators.required]
    });
  }

  /**
   * Ajout dans la base de données et redirection
   */
  submit(): void {
    this.form.value.photo = this.hashPhoto;
    this.firebaseService.add(this.form.value);
    this.router.navigateByUrl('/');
  }

  /**
   * Insertion de l'image dans le storage de firebase
   * @param event Evenement upload
   */
  uploadFile(event: any): void {
    // Hash de nom de la photo
    this.hashPhoto = Md5.hashStr(this.form.value.photo);

    // Récupération du fichier
    const file = event.target.files[0];

    // Chemin d'accès au storage de firebase
    const filePath = 'gs://cloud-messaging-29ea2.appspot.com/image_app/' + this.hashPhoto;

    // Référence du chemin d'accès et upload
    const ref = this.storage.refFromURL(filePath);
    const task = ref.put(file);

    this.pcent = task.percentageChanges();
  }
}
