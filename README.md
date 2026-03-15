## le plan du proojet WelabCosmetic 



## Adaptation du fichier docker-compose.yml

Il faut modifier les lignes suivantes dans docker-compose.yml :

- USERNAME est votre nom d'utilisateur
- UID votre identifiant utilisateur
- MAIL
- NAME


## Démarrage

L'utilisation est:

    docker compose up --build -d


# Vérifier que ça tourne
docker-compose ps


# creer le backend
docker exec -ti LaboWelab  bash

symfony new weLab_backend --api

# faut ajouter la bibliotheque bundle
pour les migrations
cd welab_backend
symfony composer require symfony/maker-bundle --dev

au cas de souci 
vider le cache
rm -rf var/cache/*
ou
symfony console cache:clear

- il faut aussi
 1 Installer ORM 
symfony composer require orm

 2 Ensuite, installer fixtures
symfony composer require --dev orm-fixtures

# 2. Dans le projet
cd /var/www/html/welab_backend

# connecte symfony a postgresql
DATABASE_URL="postgresql://labo_user:labo_password1234@database:5432/labo_stock?serverVersion=15&charset=utf8"

# 3. Crée la base de données
php bin/console doctrine:database:create

# 4. Tester la connexion
php bin/console doctrine:database:create --if-not-exists  
// marche et affiche Database "labo_stock" for connection named default already exists. Skipped.

# Toujours dans le conteneur pour creer une entite
symfony console make:entity 
ou 
php bin/console make:entity --api-resource

# les migrations
php bin/console make:migration
php bin/console doctrine:migrations:migrate

symfony server:start --port=8000 --listen-ip=0.0.0.0 --no-tls&

puis on accede du port

localhost:8011/api

--------
# pour le frontend
donc  
docker exec -it LaboWelab /bin/bash

on peut creer maintenant

## 2.creation du fronend angular

ng new welab_frontend

Stylesheet format : Choisis CSS (avec les flèches et Enter)

Enable SSR/SSG : Non (N)

# 3.pour lancer le server 
cd welab_frontend
  ng serve --host 0.0.0.0 &
ou ouvrir un autre terminal et lancer ca 
  ng serve --host 0.0.0.0 et le laissser ouvert

puis on a acces sur localhost:8021

- on ajoute ca cest imprtant pour lutilisation des donner json envoyer sous forme member[]
Fichier src/app/services/api-response.ts
typescript
export interface ApiResponse<T> {
  member: T[];
}

- faut ajouter httpclient a app.config.ts 
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient()
  ]
};
---

# creation de home page
- backend
symfony console make:controller HomeController 

 modifie pour quil envoie des donnee en json 

--
- frontend

ng generate component home.component
relier les routes dans app.routes.ts
ajouter le componenet dans app.html <app-home></app-home>

--
backend

# entite Matiere Premiere
symfony console make:entity MatPremiere

nomMP string 120 no
INCI string 200 yes
NOI string 60 yes
categorie string 80 yes
fonction string 255 yes 
cosmos string 10 yes 

verifie quil ya [ApiResource]

- les fictures : MatPremiere.fixtures.php
symfony console make:fixtures

symfony console make:migration
php bin/console doctrine:migrations:migrate

Charge les données de test
php bin/console doctrine:fixtures:load

# entite fournisseur
php bin/console make:entity Fournisseur

nomEntr string 200 no
adresse string 200 yes
emailGen tring 200 yes
telFourni string 30 yes

verifie quil ya [ApiResource]
les fixtures
php bin/console make:fixtures

# entite distribution
php bin/console make:entity Distribution

nomMarque string 200 no
fournisseur ManyToOne Fournisseur no  distributions  no(orphanremoval)

php bin/console make:fixtures

# entite contactFournisseur
php bin/console make:entity ContactFournisseur

nom string 60 no
prenom string 60 yes
fonction string 255 yes
email string 225 yes
telContact string 30 yes 
fournisseur ManyToOne Fournisseur null= no ,  yes ,contactFournisseurs , orphaned no

les fixtures 
utiliser  implements DependentFixtureInterface pour utiliser les methode addReferences et getReference et getDependencies
pour pouvoir faire lordre entre loading des fixtures

