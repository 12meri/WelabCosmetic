# WelabCosmetic

Projet complet de gestion pour WelabCosmetic, combinant un backend Symfony (API Platform) et un frontend Angular.

## Sommaire
- [Présentation](#présentation)
- [Technologies]
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation avec Docker](#installation-avec-docker)
- [Installation manuelle](#installation-manuelle)
- [Lancement du projet](#lancement-du-projet)
- [Configuration]
- [Base de données]
- [Documentation API] // TODO
- [Utilisateur par defaut] // TODO
- [Securite] // TODO
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
- Bootstrap 5

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
2. Lancer les services :
	```bash
	docker-compose up --build
	```
3. Accéder à l'API : http://localhost:8011/api
4. Accéder au frontend : http://localhost:8021


## Installation manuelle

### Backend (Symfony)
```bash
cd workspace/weLab_backend
composer install
cp .env .env.local # puis configurer la BDD
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

Modifier `.env.local` avec tes identifiants :
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

login:

Matiere premieres:
  GET `api/matiere_premieres`  Liste des Mp ROLE_USER
  GET `api/matiere_premieres/{id}`  Detail d'une Mp ROLE_USER
  POST `api/matieres_premieres/add` creer une Mp ROLE_ADMIN
  PUT `api/matiere_premieres/{id}/edit` modifier une Mp ROLE_ADMIN
  DELETE `api/matiere_premieres/{id}/delete` supprimer une Mp ROLE_ADMIN

lot:
distributions:
fournisseurs:
contact_fournisseur:
alertes:

## Utilisateur par defaut
pour exemple 
| Email             | Mot de passe | Rôle       |
|------- -----------|--------------|------------|
| admin@example.com | admin123     | ROLE_ADMIN |
| user@example.com  | user123      | ROLE_USER  |

## Securite
- Authentification par JWT
- Rôles : ROLE_USER, ROLE_ADMIN
- Voters pour les permissions fines
- CORS configuré pour Angular

## Auteurs

- OULD TALEB Meriem
- ZAKRAF Rania
- HASSANI Aya
