import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FirebaseService } from '../firebase.service';
import { Map, tileLayer, marker } from 'leaflet';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  user: any;
  dateNaissance: any;
  age: any;
  map: Map;
  newMarker: any;
  address: string[];
  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };


  constructor(
    public modalController: ModalController,
    public firebase: FirebaseService,
    public storage: Storage,
    public nativeGeocoder: NativeGeocoder
  ) { }

  ngOnInit() {
    // Récupération identifiant utilisateur et du document associé
    this.storage.get('user_id').then((id) => {
      this.firebase.getCurrentUser(id).then(doc => {
        if (doc.exists) {
          this.user = doc.data();

          // Construction de la date de naissance
          const date = new Date(Date.parse(this.user.naissance));
          this.dateNaissance = ('0' + date.getDate()).slice(-2) + '/'
            + ('0' + (date.getMonth() + 1)).slice(-2) + '/'
            + date.getFullYear();

          // Récupération de l'âge
          this.age = this.getAge(this.user.naissance);

          // Récupération de la latitude et longitude associée à l'adresse
          this.nativeGeocoder.forwardGeocode(this.user.adresse + ' ' + this.user.ville, this.options)
            .then((result: NativeGeocoderResult[]) => {
              console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude)
              this.loadMap(result[0].latitude, result[0].longitude)
            })
            .catch((error: any) => console.log(error));
        }
      });
    });
  }

  /**
   * Chargement de la map
   * @param lat Latitude
   * @param lng Longitude
   */
  loadMap(lat, lng) {
    // Création de la map
    this.map = new Map("map").setView([lat, lng], 13);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: 'Map data © <a href="https://www.openstreetmap.org/"> OpenStreetMap </a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/" > CC - BY - SA </a>'
      })
      .addTo(this.map);

    // Création du marker
    this.newMarker = marker([lat, lng], {
      draggable:
        true
    }).addTo(this.map);

    // Affichage du marker
    this.newMarker.bindPopup(this.user.adresse).openPopup();
  }

  /**
   * Retourne l'âge en fonction de la date de naissance
   * @param dateOfBirth Date de naissance
   */
  getAge(naissance: any): number {
    // Aujourd'hui
    const today = new Date();

    // Date de naissance
    const birthDate = new Date(naissance);

    // Différence des années
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    // Au cas ou la différence des mois, une année de différence
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Retour à la page principale
   */
  dismiss() {
    this.modalController.dismiss();
  }

}
