import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.page.html',
  styleUrls: ['./discussion.page.scss'],
})
export class DiscussionPage implements OnInit {
  @ViewChild('content') public content: any;
  utilisateur: string;
  form: FormGroup;
  recepteurId: string;
  messages: Observable<any[]>;
  expediteurId: string;

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    public firebase: FirebaseService,
    public storage: Storage
  ) {
    // Création du formulaire
    this.form = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Récupération de la discussion
    this.utilisateur = this.route.snapshot.paramMap.get('nom_utilisateur');
    this.recepteurId = this.route.snapshot.paramMap.get('userId');
    this.storage.get('user_id').then(val => {
      this.expediteurId = val;
      this.firebase.getDiscuss().then(value => {
        this.messages = value;
      });
    });
  }

  scroll() {
    this.content.scrollToBottom(0);
  }

  /**
   * Envoi d'un message
   */
  submit() {
    // Si la textarea contient un message
    if (this.form.value.message !== '') {
      this.firebase.sendMessage({
        expediteur_id: this.expediteurId,
        recepteur_id: this.recepteurId,
        date_envoie: '',
        message: this.form.value.message
      }).then(() => this.form.reset());
    }
  }
}
