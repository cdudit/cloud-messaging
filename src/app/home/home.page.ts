import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public router: Router
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
}
