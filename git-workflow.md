# Git Workflow — Food Manager

## Objectif

Définir un workflow Git commun pour les repositories **food-manager-front** et **food-manager-back**.

> Le repository **food-manager-docs** conserve une unique branche `main` et n'utilise pas ce workflow.

---

## Branches

### Branches permanentes

| Branche | Rôle |
|---|---|
| `main` | Dernière version stable, équivalente production |
| `develop` | Branche d'intégration des développements |

### Branches temporaires

```txt
feature/US-<CODE>-<nom-feature>
fix/US-<CODE>-<nom-correctif>
tech/US-<CODE>-<nom-technique>
release/vX.Y.Z
hotfix/<nom-hotfix>
```

Exemples :

```txt
feature/US-FOOD-001-create-food
feature/US-RECIPE-001-create-recipe
fix/US-FOOD-004-fix-ingredient-update
tech/US-DATA-001-setup-prisma
release/v1.0.0
hotfix/jwt-expiration
```

> Quand une User Story existe, son identifiant doit être inclus dans le nom de la branche pour garder un traçage simple entre le ticket et le développement.

---

## Vue globale du workflow

```mermaid
gitGraph
    commit id: "stable"
    branch develop
    checkout develop
    commit id: "init dev"

    branch feature/create-food
    checkout feature/create-food
    commit id: "dev food"
    commit id: "test food"
    checkout develop
    merge feature/create-food id: "merge feature"

    branch fix/login
    checkout fix/login
    commit id: "fix login"
    checkout develop
    merge fix/login id: "merge fix"

    checkout main
    branch release/v1.0.0
    checkout release/v1.0.0
    merge develop id: "merge develop"
    commit id: "release checks"

    checkout main
    merge release/v1.0.0 tag: "v1.0.0"
```

---

## Développement d'une feature

Une nouvelle fonctionnalité part de `develop`, puis revient dans `develop` via une Pull Request.

```mermaid
gitGraph
    commit id: "stable"
    branch develop
    checkout develop
    commit id: "develop ready"

    branch feature/create-recipe
    checkout feature/create-recipe
    commit id: "create recipe entity"
    commit id: "add use case"
    commit id: "add tests"

    checkout develop
    merge feature/create-recipe id: "PR feature -> develop"
```

### Étapes

1. Se positionner sur `develop`.
2. Créer une branche `feature/*`.
3. Développer et commit.
4. Ouvrir une Pull Request vers `develop`.
5. Laisser GitHub Actions lancer les checks.
6. Merger dans `develop` quand tout est validé.

---

## Correctif hors production

Un correctif non urgent part aussi de `develop`.

```mermaid
gitGraph
    commit id: "stable"
    branch develop
    checkout develop
    commit id: "current develop"

    branch fix/auth-error
    checkout fix/auth-error
    commit id: "fix auth error"
    commit id: "add regression test"

    checkout develop
    merge fix/auth-error id: "PR fix -> develop"
```

---

## Tâche technique

Une tâche technique part de `develop`, comme une feature classique.

```mermaid
gitGraph
    commit id: "stable"
    branch develop
    checkout develop
    commit id: "current develop"

    branch tech/setup-prisma
    checkout tech/setup-prisma
    commit id: "install prisma"
    commit id: "add schema"
    commit id: "add migration"

    checkout develop
    merge tech/setup-prisma id: "PR tech -> develop"
```

---

## Préparation d'une release

Dans ce workflow, la branche de release est créée depuis `main`, puis `develop` est mergée dans la release.

```mermaid
gitGraph
    commit id: "v1.0.0 stable"
    branch develop
    checkout develop
    commit id: "feature foods"
    commit id: "feature recipes"
    commit id: "feature meal plans"

    checkout main
    branch release/v1.1.0
    checkout release/v1.1.0
    merge develop id: "merge develop into release"
    commit id: "release fixes"
    commit id: "final checks"

    checkout main
    merge release/v1.1.0 tag: "v1.1.0"
```

### Étapes

1. Créer `release/vX.Y.Z` depuis `main`.
2. Merger `develop` dans `release/vX.Y.Z`.
3. Lancer les checks de release.
4. Faire les corrections mineures si besoin sur la release.
5. Merger `release/vX.Y.Z` dans `main`.
6. Créer un tag `vX.Y.Z`.
7. Resynchroniser `develop` avec `main`.

---

## Hotfix production

Un hotfix sert uniquement à corriger rapidement un problème en production.

```mermaid
gitGraph
    commit id: "v1.1.0 stable"
    branch develop
    checkout develop
    commit id: "ongoing dev"

    checkout main
    branch hotfix/jwt-expiration
    checkout hotfix/jwt-expiration
    commit id: "fix jwt expiration"
    commit id: "hotfix tests"

    checkout main
    merge hotfix/jwt-expiration tag: "v1.1.1"

    checkout develop
    merge main id: "sync hotfix"
```

### Étapes

1. Créer `hotfix/*` depuis `main`.
2. Corriger le problème.
3. Merger dans `main`.
4. Créer un tag correctif.
5. Merger `main` dans `develop`.

---

## Règles de Pull Request

Toutes les modifications passent par une Pull Request.

Les pushes directs sont interdits sur :

```txt
main
develop
```

Une Pull Request doit respecter les règles suivantes :

- titre clair ;
- lien avec l'issue GitHub si possible ;
- description courte des changements ;
- CI verte ;
- absence de conflit ;
- validation avant merge.

---

## Stratégie de merge

Utiliser **Squash and Merge** pour garder un historique propre.

Exemple :

```txt
feat(food): create food management
```

plutôt qu'une suite de petits commits techniques peu lisibles.

---

## Convention de commits

Le projet utilise **Conventional Commits**.

Exemples :

```txt
feat(food): create food entity
feat(recipe): add recipe creation
fix(auth): refresh token expiration
docs(dat): update architecture
tech(cache): configure redis
refactor(food): simplify nutrition calculation
test(recipe): add unit tests
```

Types principaux :

| Type | Usage |
|---|---|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation |
| `tech` | Tâche technique |
| `refactor` | Refactor sans changement fonctionnel |
| `test` | Tests |
| `chore` | Maintenance |

---

## Protections de branches

### `main`

- push direct interdit ;
- Pull Request obligatoire ;
- CI obligatoire ;
- historique linéaire ;
- tag des versions ;
- déploiement uniquement depuis `main` ou depuis un tag.

### `develop`

- push direct interdit ;
- Pull Request obligatoire ;
- CI obligatoire ;
- branche d'intégration.

---

## GitHub Actions

### Pull Request vers `develop`

```txt
npm install
lint
tests
build
```

### Pull Request vers `main`

```txt
npm install
lint
tests
build
build Docker
```

### Tag `vX.Y.Z`

```txt
build Docker
push image
déploiement
```

---

## Versionning

Le projet suit **Semantic Versioning**.

Format :

```txt
vMAJOR.MINOR.PATCH
```

Exemples :

```txt
v1.0.0
v1.1.0
v1.1.1
```
