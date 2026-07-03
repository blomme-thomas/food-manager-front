# Food Manager — Frontend

Ce repository contient l'application frontend Angular du projet **Food Manager**.

Food Manager est une application web permettant à un utilisateur de gérer ses aliments, ses recettes, ses objectifs nutritionnels, ses programmes alimentaires et ses listes de courses.

---

## Stack technique

```txt
Angular
TypeScript
Angular Router
Reactive Forms
Signals / RxJS
SCSS ou Tailwind CSS
```

---

## Repository associé

Le projet complet est organisé en trois repositories :

```txt
food-manager-docs   # Documentation, DAT, modèle de données, user stories
food-manager-front  # Application frontend Angular
food-manager-back   # API backend NestJS
```

La documentation de référence est disponible dans le repository :

```txt
food-manager-docs
```

---

## Objectif du frontend

L'application frontend doit permettre à l'utilisateur de :

- créer un compte ;
- se connecter ;
- gérer ses aliments ;
- créer et consulter ses recettes ;
- visualiser les calories et macros d'une recette ;
- définir un objectif calorique journalier ;
- planifier ses repas sur une semaine ;
- générer une liste de courses ;
- consulter un dashboard de synthèse.

---

## Architecture cible

```txt
src/app/
  core/
    auth/
    guards/
    interceptors/
    api/
    config/

  shared/
    components/
    pipes/
    directives/
    models/

  layout/
    shell/
    sidebar/
    header/

  features/
    dashboard/
    foods/
    recipes/
    nutrition-goals/
    meal-plans/
    shopping-lists/

  app.routes.ts
```

---

## Description des dossiers

### `core/`

Contient les éléments globaux de l'application.

Exemples :

- gestion de l'authentification ;
- guards Angular ;
- interceptors HTTP ;
- services API ;
- configuration globale.

### `shared/`

Contient les éléments réutilisables.

Exemples :

- composants UI génériques ;
- pipes ;
- directives ;
- modèles TypeScript partagés.

### `layout/`

Contient la structure visuelle principale.

Exemples :

- shell applicatif ;
- header ;
- sidebar ;
- navigation principale.

### `features/`

Contient les fonctionnalités métier.

Exemples :

- dashboard ;
- aliments ;
- recettes ;
- objectifs nutritionnels ;
- programmes alimentaires ;
- listes de courses.

---

## Installation

Installer les dépendances :

```powershell
npm install
```

---

## Lancement local

Démarrer l'application :

```powershell
npm start
```

ou :

```powershell
ng serve
```

L'application sera disponible par défaut sur :

```txt
http://localhost:4200
```

---

## Scripts utiles

```powershell
npm start
npm run build
npm run test
npm run lint
npm run format
```

---

## Configuration des environnements

L'URL de l'API backend doit être configurable par environnement.

Exemple attendu :

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000'
};
```

En production, l'URL devra pointer vers l'API déployée.

---

## Authentification

Le frontend utilisera le backend pour :

```txt
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me
```

Les routes privées devront être protégées par un guard Angular.

---

## Convention de branches

Exemples de noms de branches :

```txt
feature/auth-login
feature/foods-create
feature/recipes-list
tech/setup-angular
fix/login-error-message
```

---

## Convention de commits

Exemples :

```txt
feat(auth): add login page
feat(foods): add food creation form
fix(auth): handle invalid credentials
chore(front): setup angular project
docs(front): update README
```

---

## Gestion des issues

Les issues sont suivies dans le GitHub Project :

```txt
Food Manager
```

Les conventions de labels, d'epics et de priorités sont documentées dans :

```txt
food-manager-docs/README.md
```

Exemple d'issue frontend :

```txt
TS-FRONT-001 — Initialiser le projet frontend Angular
```

Labels associés :

```txt
type:technical
priority:p0
domain:front
domain:ui
mvp:1
```

---

## Definition of Done frontend

Une tâche frontend est terminée si :

- l'écran ou le composant est développé ;
- les validations utilisateur sont présentes ;
- les erreurs principales sont affichées clairement ;
- le responsive est vérifié ;
- le lint passe ;
- le build Angular passe ;
- l'intégration API fonctionne si nécessaire ;
- la documentation est mise à jour si nécessaire.