import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.page.html',
  styleUrls: ['./discussion.page.scss'],
})
export class DiscussionPage implements OnInit {
  utilisateur: string;
  form: FormGroup;

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    public firebase: FirebaseService,
    public storage: Storage
  ) {
    this.utilisateur = this.route.snapshot.paramMap.get('nom_utilisateur');
    this.form = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  submit() {
    if (this.form.value.message !== '') {
      this.storage.get('user_id').then(val => {
        this.firebase.sendMessage({
          expediteur_id: val,
          recepteur_id: this.route.snapshot.paramMap.get('userId'),
          date_envoie: '',
          message: this.form.value.message
        });
      });
    }
  }
}
