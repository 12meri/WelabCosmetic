
docker compose up --build -d

dans 2 terminal different a laisser ouvert

# lancer le serveur symfony
codesi> docker exec -ti LaboWelab bash
[ meriem | /var/www/html ] cd weLab_backend/
[ meriem | /var/www/html/weLab_backend ] symfony server:start --port=8000 --listen-ip=0.0.0.0 --no-tls&

acces http://localhost:8011/api

pour larreter 
ctrl + C
symfony server:stop


# lancer le server angular
 codesi> docker exec -ti LaboWelab bash
[ meriem | /var/www/html ] cd welab_frontend/
[ meriem | /var/www/html/welab_frontend ]  ng serve --host 0.0.0.0 --port 4200 --poll=2000  // pour le devellopement

access http://localhost:8021/

pour larreter 
ctrl C

# les utilisateurs:

##admin
    "email": "admin@example.com",
    "password": "admin123"
##stagiare
    "email": "stagiare@example.com",
    "password": "stage123"

    


## Rania
a creer les interfaces:
- login
- matiere 1ere
- lot
- alerte
- demande echantillon

a modifier apres l'interface de login et register 
note: pour le moment aucune authentification necessaire
apres que je creer lentite email et document leur champs sont a ajouter 



## Aya
note: dans les page html vaforiser le @for avec trakby et @if par apport a ngfor ou nfif 
note: le menu et le footer sont independant des interface que n=vous avez a creer
note: lattribut doc nest pas encore creer dans le backend -> a ne pas ajouter au formulaire pour le moment
et lentite user et email aussi pas encore creer 
note: si vous etes sur windows avec wsl le chargement des donnees json prends un peu de temps doonc pour que le tableau ou le form des interface prenne les donnees faut attendre un peu (40s temps de chargement)
sinon si cest linux je croix pas ya un souci dattente 
note: rien a toucher pour les file.spec.ts
# creer les interface
les interface sont ajouter dans models 
ng generate interface models/Fournisseur

- interface fournisseur

les donnees json  url  http://localhost:8011/api/fournisseurs


le model 
ng generate interface models/Fournisseur

pour chaque component dans le dossier fournisseur( a creer /src/app/fournisseurs)
ng generate component fournisseurs-list     --> pour la liste fournisseurs
ng generate component fournisseurs-add      --> pour ajouter fournisseur
ng generate component fournisseurs-edit     --> pour modifier fournisseur
soit ng generate component fournisseurs-delete ou juste un bouton avec js dans la page liste fournisseur --> supprimer fournisseur

son service 
ng generate service services/FournisseurService --> creer le file fournisseurs-service.ts





- interface distributions ( elle peut etre afficher dans unepage seul mais aussi etre acceder a partir de linterface fournisseur justement pour ajouter les distribution au bon fournisseurs )

les donneees json sont recuper sur  url http://localhost:8011/api/distributions

le model
 ng generate interface models/Distributions

pour chaque component dans le dossier distributions( a creer /src/app/distributions)
ng generate component distributions-list       --> pour la liste distributions
ng generate component distributions-add        --> ajouter distribution ( choix de fournisseurs et choix mp et choix contact fournisseur(optionel) )
ng generate component distributions-edit        --> modifier distribution
soit ng generate component distributions-delete ou juste un bouton avec js dans la page liste distributions  --> supprimer distribution

son service
ng generate service services/DistributionService --> creer le file distributions-service.ts 


- interface contact-fournisseur --- l'entite fournir devra etre utiliser  (les meme cmd que les precedente interfaces)

les donnees json url http://localhost:8011/api/contact_fournisseurs


liste contact-fournisseur
ajouter contact fournisser ( apartir de fournisseur pour savoir de quel entr le contact fait parti , et le lier a une distribution (un cas qui peut etre optionel lors de la creation et modifiable pas la suite soit a partir de fournisseru --> contact four ou a partir de distribution -> les conatct fournisseur de lentreprise(fournisseur) en question ))



- interface emeil et interface document pas encore a faire apres que je recupere le travail (cest bon entites creer fixture creer ) 

pour le routage des composent (interface); il suffit dajouter les path dans app.router.ts

----------------
