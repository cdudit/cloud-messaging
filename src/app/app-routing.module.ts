import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ContactCardComponent } from './contact-card/contact-card.component';
import { MessageComponent } from './message/message.component';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/']);

const redirectLoggedInToContacts = () => redirectLoggedInTo(['/contacts']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    ...canActivate(redirectLoggedInToContacts)
  },
  {
    path: 'contacts',
    loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'subscribe',
    loadChildren: () => import('./subscribe/subscribe.module').then(m => m.SubscribePageModule)
  },
  {
    path: 'contact-card', component: ContactCardComponent
  },
  {
    path: 'message', component: MessageComponent
  },
  {
    path: 'discussion',
    loadChildren: () => import('./discussion/discussion.module').then(m => m.DiscussionPageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('./profil/profil.module').then( m => m.ProfilPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
