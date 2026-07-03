# Instructions Copilot — Food Manager Frontend

Tu travailles sur le frontend Angular du projet Food Manager.

Stack frontend :
- Angular
- TypeScript
- Angular Router
- Reactive Forms
- Signals / RxJS
- SCSS ou Tailwind selon la décision du projet

Objectif frontend :
Créer une interface claire permettant à l'utilisateur de gérer :
- son compte ;
- ses aliments ;
- ses recettes ;
- ses objectifs nutritionnels ;
- son planning alimentaire ;
- ses listes de courses ;
- son dashboard.

Architecture cible :
- Monolithe modulaire Angular.
- chaque feature métier correspond à un composant
- un dossier core pour les services et composants comme l'authentification, le routing, les guards, les interceptors, etc.
- un dossier features pour les composants métier, chacun avec son propre module Angular.
- un dossier layout pour les composants de layout (header, footer, sidebar, etc.)
- un dossier shared pour les composants réutilisables (boutons, inputs, modals, etc.)

Règles :
- Répondre en français.
- Utiliser une structure par feature.
- Ne pas mettre les appels HTTP directement dans les composants.
- Centraliser les appels API dans des services dédiés.
- Utiliser les guards pour les routes privées.
- Utiliser un interceptor pour le token JWT.
- Garder les composants lisibles et découpés.
- Gérer les erreurs utilisateur avec des messages clairs.
- Prévoir un affichage responsive desktop/mobile.
- Ne pas inventer d'endpoint : se baser sur les contrats API documentés.