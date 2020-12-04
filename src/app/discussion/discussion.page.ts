import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.page.html',
  styleUrls: ['./discussion.page.scss'],
})
export class DiscussionPage implements OnInit {
  utilisateur: string;

  constructor(private route: ActivatedRoute) {
    this.utilisateur = this.route.snapshot.paramMap.get('nom_utilisateur');
  }

  ngOnInit() {
  }

}
