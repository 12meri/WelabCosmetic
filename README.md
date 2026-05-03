# WelabCosmetic

Projet complet de gestion pour WelabCosmetic, combinant un backend Symfony (API Platform) et un frontend Angular.

## Sommaire

- [Présentation](#présentation)
- [Technologies](#technologies)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation avec Docker](#installation-avec-docker)
- [Installation manuelle](#installation-manuelle)
- [Lancement du projet](#lancement-du-projet)
- [Configuration](#configuration)
- [Base de données](#base-de-données)
- [Documentation API](#documentation-api) 
- [Utilisateur par défaut](#utilisateur-par-défaut) 
- [Sécurité](#sécurité) 
- [Auteurs](#auteurs)


## Présentation

Ce projet vise à fournir une plateforme complète pour la gestion des activités de WelabCosmetic, avec une API RESTful sécurisée (Symfony/API Platform) et une interface utilisateur moderne (Angular).

## Technologies
**Backend :**
- Symfony 6.4
- API Platform
- Doctrine ORM
- JWT Authentication
- Postgresql

**Frontend :**
- Angular 17

## Structure du projet

```
WelabCosmetic/
├── workspace/
│   ├── weLab_backend/    # Backend Symfony (API, JWT, Doctrine, etc.)
│   └── welab_frontend/   # Frontend Angular
├── docker-compose.yml    # Orchestration Docker
├── Dockerfile            # Image Docker personnalisée
└── README.md             # Ce fichier
```

## Prérequis

- Docker & Docker Compose (recommandé)
- Ou bien :
  - PHP 8.2+
  - Composer
  - Node.js 18+
  - npm
  - PostgreSQL 15+
  - Symfony CLI (optionnel)

## Installation avec Docker

1. Cloner le dépôt :
	```bash
	git clone https://github.com/12meri/WelabCosmetic.git
	cd WelabCosmetic
	```

  Dans `docker-compose.yml`, modifier les informations suivantes selon l'utilisateur de votre machine :
  ```yml
    args:
          USERNAME: meriem # À Modifier
          UID: 1000        # À Modifier
          EMAIL: meriem.ould-taleb@univ-orleans.fr # À Modifier
          NAME: "Meriem" # À Modifier
  ```
2. Lancer les services :
	```bash
	docker-compose up --build
	```
  Dans deux terminaux différents :
  
  Pour lancer le serveur Symfony :
  ```bash
  docker exec -ti LaboWelab bash
  [ USERNAME | /var/www/html ] cd weLab_backend/
  [ USERNAME | /var/www/html/weLab_backend ] symfony server:start
  ```
  Pour lancer le serveur Angular :
  ```bash
   docker exec -ti LaboWelab bash
  [ USERNAME | /var/www/html ] cd welab_frontend/
  [ USERNAME | /var/www/html/welab_frontend ]  ng serve

3. Accéder à l'API : http://localhost:8011/api/docs
4. Accéder au frontend : http://localhost:8021 --> le site web


## Installation manuelle

### Backend (Symfony)
```bash
cd workspace/weLab_backend
composer install
cp .env .env.local # puis configurer la BDD a ne pas versionner
php bin/console doctrine:database:create --if-not-exists
php bin/console doctrine:migrations:migrate
php bin/console lexik:jwt:generate-keypair
symfony server:start # ou php -S localhost:8000 -t public
```

### Frontend (Angular)
```bash
cd workspace/welab_frontend
npm install
ng serve
```

## Lancement du projet

- Backend : http://localhost:8011
- Frontend : http://localhost:8021

## Configuration

### Backend
Copier le fichier d'environnement :
```bash
cd workspace/weLab_backend
cp .env .env.local 
```

Modifier `.env.local` avec tes identifiants : # a ne pas versionner
```env
DATABASE_URL="postgresql://user:password@127.0.0.1:5432/mp_gestion?serverVersion=15&charset=utf8"
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=tonpassphrase
```

### Frontend
Copier le fichier d'environnement :
```bash
cd workspace/welab_frontend
cp src/environments/environment.ts src/environments/environment.local.ts
```

Modifier `environment.local.ts` :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8011/api'
};
```
## Base de données

### Créer la base
```bash
cd workspace/weLab_backend
php bin/console doctrine:database:create
```

### Exécuter les migrations
```bash
php bin/console doctrine:migrations:migrate
```

### Charger les données de test
```bash
php bin/console doctrine:fixtures:load
```

## Documentation API

**Authentification**  
- `POST api/login_check` : Authentification JWT (renvoie token)

### Matières premières
- `GET api/matieres_premieres` : Liste des MP – `ROLE_USER`
- `GET api/matieres_premieres/{id}` : Détail d’une MP – `ROLE_USER`
- `POST api/matieres_premieres` : Créer une MP – `ROLE_ADMIN`
- `PATCH api/matieres_premieres/{id}` : Modifier une MP – `ROLE_ADMIN`
- `DELETE api/matieres_premieres/{id}` : Supprimer une MP – `ROLE_ADMIN`

### Lots
- `GET api/lots` : Liste des lots – `ROLE_USER`
- `GET api/lots/{id}` : Détail d’un lot – `ROLE_USER`
- `POST api/lots` : Créer un lot – `ROLE_USER`
- `PATCH api/lots/{id}` : Modifier un lot – `ROLE_USER`
- `DELETE api/lots/{id}` : Supprimer un lot – `ROLE_ADMIN`

### Fournisseurs
- `GET api/fournisseurs` : Liste des fournisseurs – `ROLE_USER`
- `GET api/fournisseurs/{id}` : Détail d’un fournisseur – `ROLE_USER`
- `POST api/fournisseurs` : Créer un fournisseur – `ROLE_ADMIN`
- `PATCH api/fournisseurs/{id}` : Modifier un fournisseur – `ROLE_ADMIN`
- `DELETE api/fournisseurs/{id}` : Supprimer un fournisseur – `ROLE_ADMIN`

### Contact fournisseurs
- `GET api/contact_fournisseurs` : Liste des contacts – `ROLE_USER`
- `GET api/contact_fournisseurs/{id}` : Détail d’un contact – `ROLE_USER`
- `POST api/contact_fournisseurs` : Ajouter un contact – `ROLE_USER`
- `PATCH api/contact_fournisseurs/{id}` : Modifier un contact – `ROLE_USER`
- `DELETE api/contact_fournisseurs/{id}` : Supprimer un contact – `ROLE_ADMIN`

### Distributions
- `GET api/distributions` : Liste des distributions – `ROLE_USER`
- `GET api/distributions/{id}` : Détail d’une distribution – `ROLE_USER`
- `POST api/distributions` : Créer une distribution – `ROLE_USER`
- `PATCH api/distributions/{id}` : Modifier une distribution – `ROLE_USER`
- `DELETE api/distributions/{id}` : Supprimer une distribution – `ROLE_ADMIN`

### Alertes
- `GET api/alertes` : Liste des alertes – `ROLE_USER`
- `GET api/alertes/{id}` : Détail d’une alerte – `ROLE_USER`
- `POST api/alertes` : Créer une alerte – `ROLE_USER`
- `PATCH api/alertes/{id}` : Marquer une alerte comme lue / modifier – `ROLE_USER`
- `DELETE api/alertes/{id}` : Supprimer une alerte – `ROLE_ADMIN`

### Demandes d’échantillon
- `GET api/demandes_echantillon` : Liste des demandes – `ROLE_USER`
- `GET api/demandes_echantillon/{id}` : Détail d’une demande – `ROLE_USER`
- `POST api/demandes_echantillon` : Créer une demande – `ROLE_USER`
- `PATCH api/demandes_echantillon/{id}` : Modifier une demande – `ROLE_USER`
- `DELETE api/demandes_echantillon/{id}` : Supprimer une demande – `ROLE_ADMIN`

### Emails
- `GET api/emails` : Liste des emails – `ROLE_USER`
- `GET api/emails/{id}` : Détail d’un email – `ROLE_USER`
- `POST api/emails` : Envoyer / créer un email – `ROLE_USER`
- `PATCH api/emails/{id}` : Modifier un email – `ROLE_USER`
- `DELETE api/emails/{id}` : Supprimer un email – `ROLE_ADMIN`

### Documents
- `GET api/documents` : Liste des documents – `ROLE_USER`
- `GET api/documents/{id}` : Télécharger / voir un document – `ROLE_USER`
- `POST api/documents` : Uploader un document – `ROLE_USER`
- `PATCH api/documents/{id}` : Modifier les métadonnées d’un document – `ROLE_USER`
- `DELETE api/documents/{id}` : Supprimer un document – `ROLE_ADMIN`

### Fournir (approvisionnement MP par fournisseur)

- `GET api/fournirs` : Liste des relations Fournir – `ROLE_USER`
- `GET api/fournirs/{id}` : Détail d’une relation Fournir – `ROLE_USER`
- `POST api/fournirs` : Créer une relation Fournir – `ROLE_ADMIN`
- `PATCH api/fournirs/{id}` : Modifier une relation Fournir – `ROLE_ADMIN`
- `DELETE api/fournirs/{id}` : Supprimer une relation Fournir – `ROLE_ADMIN`

### Distribue (distribution de lots)

- `GET api/distribues` : Liste des relations Distribue – `ROLE_USER`
- `GET api/distribues/{id}` : Détail d’une relation Distribue – `ROLE_USER`
- `POST api/distribues` : Créer une relation Distribue – `ROLE_ADMIN`
- `PATCH api/distribues/{id}` : Modifier une relation Distribue – `ROLE_ADMIN`
- `DELETE api/distribues/{id}` : Supprimer une relation Distribue – `ROLE_ADMIN`

### Administration – comptes utilisateurs (ROLE_ADMIN uniquement) - **À VENIR**
- `GET api/admin/comptes` : Liste tous les utilisateurs – `ROLE_ADMIN`
- `GET api/admin/comptes/{id}` : Détail d’un utilisateur – `ROLE_ADMIN`
- `POST api/admin/comptes` : Créer un utilisateur (stagiaire ou admin) – `ROLE_ADMIN`
- `PUT api/admin/comptes/{id}` : Modifier un utilisateur (rôle, email, etc.) – `ROLE_ADMIN`
- `DELETE api/admin/comptes/{id}` : Supprimer un utilisateur – `ROLE_ADMIN`



### Mot de passe oublié
- `POST api/forgot-password` : Demander la réinitialisation du mot de passe – public
- `POST api/reset-password` : Réinitialiser le mot de passe avec le token reçu – public

## Utilisateur par défaut
Par exemple  
| Email                  | Mot de passe | Rôle       |
|------------------------|--------------|------------|
| admin@example.com      | admin123     | ROLE_ADMIN |
| stagiaire@example.com  | stage123     | ROLE_USER  |

## Sécurité
- Authentification par JWT
- Rôles : ROLE_USER, ROLE_ADMIN
- CORS configuré pour Angular (config/packages/api_platform.yaml, nelmio_cors.yaml)

## Auteurs

- OULD TALEB Meriem
- ZAKRAF Rania
- HASSANI Aya
