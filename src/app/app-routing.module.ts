import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ContactCardComponent } from './contact-card/contact-card.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'subscribe',
    loadChildren: () => import('./subscribe/subscribe.module').then(m => m.SubscribePageModule)
  },
  {
    path: 'contacts',
    loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsPageModule)
  },
  {
    path: 'contact-card', component: ContactCardComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
