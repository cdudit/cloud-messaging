import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FirebaseService } from '../firebase.service';
import { Map, tileLayer, marker, LatLngExpression, LatLng, Marker } from 'leaflet';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { Coordinates } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  user: any;
  dateNaissance: string;
  age: number;
  map: Map;
  newMarker: Marker;
  markerLastPos: Marker;
  urlPhoto: string;
  address: string[];
  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  constructor(
    public modalController: ModalController,
    public firebase: FirebaseService,
    public storage: Storage,
    public nativeGeocoder: NativeGeocoder,
    public afStorage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    // Récupération identifiant utilisateur et du document associé
    this.storage.get('userId').then((id: string) => {
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
              console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude);
              this.loadMap(parseFloat(result[0].latitude), parseFloat(result[0].longitude));
            })
            .catch((error: any) => console.log(error));

          this.afStorage.ref('image_app/' + this.user.photo).getDownloadURL().subscribe((val: string) => {
            this.urlPhoto = val;
          });
        }
      });
    });
  }

  /**
   * Chargement de la map
   * @param lat Latitude
   * @param lng Longitude
   */
  loadMap(lat: number, lng: number): void {
    // Création de la map
    this.map = new Map('map').setView([lat, lng], 13);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://www.openstreetmap.org/"> OpenStreetMap </a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/" > CC - BY - SA </a>'
    }).addTo(this.map);

    // Création du marker
    this.newMarker = marker([lat, lng], {
      draggable: true
    }).addTo(this.map);

    // Récupération de la dernière localisation
    this.storage.get('lastLocation').then((val: Coordinates) => {
      if (val) {
        this.markerLastPos = marker([val.latitude, val.longitude], {
          draggable: true
        }).addTo(this.map);

        // Affichage du marker
        this.markerLastPos.bindPopup('Dernière position').openPopup();
      }
    });

    // Affichage du marker
    this.newMarker.bindPopup('Domicile: ' + this.user.adresse).openPopup();
  }

  /**
   * Retourne l'âge en fonction de la date de naissance
   * @param dateOfBirth Date de naissance
   */
  getAge(naissance: Date): number {
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
  dismiss(): void {
    this.modalController.dismiss();
  }

}
