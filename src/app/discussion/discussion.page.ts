import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute
  ) {
    this.utilisateur = this.route.snapshot.paramMap.get('nom_utilisateur');
    this.form = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  submit() {
    if (this.form.value.message === '') {

    }
  }

}
