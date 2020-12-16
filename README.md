# cloud-messaging

## Auteur

DUDIT Clément - LP Développement mobile & IoT

## A propos

Ce projet à pour but de créer une application de messagerie simple avec les éléments d'une messagerie très basique avec enregistrement de compte et discussion via messages.

## Technologies utilisées

Afin de mener à bien ce projet, j'ai utilisé Angular et Ionic pour créer une application hybride.
<br/>Pour la sauvegarde des messages, j'ai utilisé Firebase avec les services associés tels que Firestore et FireAuth pour la gestion des profils.

## Installation

Vous pouvez cloner l'application grâce à la commande suivante:
```bash
git clone https://github.com/cdudit/cloud-messaging.git
```

Maintenant, vous pouvez lancer l'app via:
```bash
cd CloudMessaging/
ionic serve
```

Cela vous permettra de l'avoir dans le navigateur. L'utiliser en version Android ou iOS est préférable pour bénéficier de toutes les fonctionnalités:
```bash
ionic cap run ios
```

## Fonctionnalités

### Création de compte
Avant de vous connecter, vous devez évidemment vous créer un compte via l'interface dédiée.

### Gestion des conversations
A votre première arrivée sur l'intreface principale, on vous demandera d'accéder à votre position, celle-ci n'est enregistrée que sur votre appareil.
<br/>Vous retrouverez les différentes conversations avec les autre comptes enregistrés auprès de FireAuth.
<br/>Vous pouvez afficher la photo de profil de votre interlocuteur dans une alerte en cliquant dessus.

### Votre profil
Dans cette interface, vous retrouverez vos informations, votre photo de profil ainsi qu'une carte avec la position de votre domicile que vous avez renseigné ainsi que la dernière position géolocalisée.
