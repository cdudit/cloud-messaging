import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SubscribePage } from '../subscribe/subscribe.page';

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
    public modalController: ModalController
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: ['', Validators.required],
      mdp: ['', Validators.required]
    });
  }

  submit() {
    console.log(this.form.value);
  }

  async goSubscribe() {
    const modal = await this.modalController.create({
      component: SubscribePage,
      swipeToClose: true
    });
    return await modal.present();
  }
}
