import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscussionPageRoutingModule } from './discussion-routing.module';

import { DiscussionPage } from './discussion.page';
import { MessageComponent } from '../message/message.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscussionPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [DiscussionPage, MessageComponent]
})
export class DiscussionPageModule { }
