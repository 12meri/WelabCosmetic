<?php

namespace App\DataFixtures;

use App\Entity\Fournisseur;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class FournisseurFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);
        $fournisseurs = [
            [
                'nom' => 'CRODA',
                'adresse' => 'Cowick Hall, Snaith, Goole DN14 9AA, Royaume-Uni',
                'email' => 'contact@croda.com',
                'tel' => '+44 1405 860551'
            ],
            [
                'nom' => 'BASF',
                'adresse' => 'Carl-Bosch-Straße 38, 67056 Ludwigshafen, Allemagne',
                'email' => 'info@basf.com',
                'tel' => '+49 621 600'
            ],
            [
                'nom' => 'Givaudan',
                'adresse' => '5 Chem. de la Parfumerie, 1214 Vernier, Suisse',
                'email' => 'contact@givaudan.com',
                'tel' => '+41 22 780 91 11'
            ],
            [
                'nom' => 'Symrise',
                'adresse' => 'Mühlenfeldstraße 1, 37603 Holzminden, Allemagne',
                'email' => 'contact@symrise.com',
                'tel' => '+49 5531 900'
            ],
            [
                'nom' => 'Gattefossé',
                'adresse' => '36 Rue Paul Cazeneuve, 69800 Saint-Priest, France',
                'email' => 'info@gattefosse.com',
                'tel' => '+33 4 72 22 98 00'
            ],
            [
                'nom' => 'Seppic',
                'adresse' => '50 Boulevard National, 92250 La Garenne-Colombes, France',
                'email' => 'contact@seppic.com',
                'tel' => '+33 1 40 86 58 00'
            ],
            [
                'nom' => 'Soliance',
                'adresse' => 'Parc d\'activités du Bois de l\'Etang, 77430 Champagne-sur-Seine, France',
                'email' => 'contact@soliance.com',
                'tel' => '+33 1 64 79 16 16'
            ],
            [
                'nom' => 'Clariant',
                'adresse' => 'Rothausstrasse 61, 4132 Muttenz, Suisse',
                'email' => 'info@clariant.com',
                'tel' => '+41 61 469 51 11'
            ],
            [
                'nom' => 'Evonik',
                'adresse' => 'Rellinghauser Straße 1-11, 45128 Essen, Allemagne',
                'email' => '',
                'tel' => '+49 201 177 01'
            ],
            [
                'nom' => 'Ashland',
                'adresse' => '',
                'email' => 'info@ashland.com',
                'tel' => ''
            ],
            
            [
                'nom' => 'Cargill',
                'adresse' => '15407 McGinty Road West, Wayzata, MN 55391, États-Unis',
                'email' => 'contact@cargill.com',
                'tel' => '+1 952 742 6000'
            ],
            [
                'nom' => 'Floratech',
                'adresse' => '1151 N. Fiesta Blvd, Gilbert, AZ 85233, États-Unis',
                'email' => 'info@floratech.com',
                'tel' => '+1 480 545 7000'
            ],
            [
                'nom' => 'AAK',
                'adresse' => 'Skrivaregatan 9, 293 38 Karlshamn, Suède',
                'email' => 'info@aak.com',
                'tel' => '+46 454 820 00'
            ],
            [
                'nom' => 'KOSTER',
                'adresse' => '3 Middlebury Blvd, Waterbury, CT 06708, États-Unis',
                'email' => 'info@kosterinc.com',
                'tel' => '+1 203 573 5000'
            ],
            [
                'nom' => 'Sun Chemical',
                'adresse' => '35 Waterview Blvd, Parsippany, NJ 07054, États-Unis',
                'email' => 'contact@sunchemical.com',
                'tel' => '+1 973 404 6000'
            ],
            [
                'nom' => 'Merck',
                'adresse' => 'Frankfurter Straße 250, 64293 Darmstadt, Allemagne',
                'email' => 'contact@merckgroup.com',
                'tel' => '+49 6151 720'
            ],
            [
                'nom' => 'CP Kelco',
                'adresse' => '3100 Cumberland Blvd, Atlanta, GA 30339, États-Unis',
                'email' => 'info@cpkelco.com',
                'tel' => '+1 678 247 7300'
            ],
            [
                'nom' => 'Daito Kasei',
                'adresse' => '6-28 Akasaka 9-chome, Minato-ku, Tokyo 107-0052, Japon',
                'email' => 'info@daitokasei.co.jp',
                'tel' => '+81 3 5413 5211'
            ],
            [
                'nom' => 'Jungbunzlauer',
                'adresse' => 'St. Alban-Vorstadt 90, 4052 Bâle, Suisse',
                'email' => 'contact@jungbunzlauer.com',
                'tel' => '+41 61 295 51 00'
            ],
            [
                'nom' => 'Stéarinerie',
                'adresse' => 'Route de Dijon, 21110 Genlis, France',
                'email' => 'contact@stearinerie.com',
                'tel' => '+33 3 80 47 20 00'
            ],
            [
                'nom' => 'Carilène',
                'adresse' => 'Parc d\'Activités de l\'Aéroport, 01150 Blyes, France',
                'email' => 'contact@carilene.com',
                'tel' => '+33 4 74 46 18 88'
            ],
            [
                'nom' => 'Vantage',
                'adresse' => '2100 N. Central Rd, Fort Lee, NJ 07024, États-Unis',
                'email' => 'info@vantagegrp.com',
                'tel' => '+1 201 585 2300'
            ],
            [
                'nom' => 'Sollice',
                'adresse' => 'Parc d\'Activités du Moulin, 76190 Yvetot, France',
                'email' => 'contact@sollice.com',
                'tel' => '+33 2 35 95 55 55'
            ],
            [
                'nom' => 'Verfilcos',
                'adresse' => 'Via Cadorna 34, 20090 Opera (MI), Italie',
                'email' => 'info@verfilcos.it',
                'tel' => '+39 02 5760 4171'
            ],
            
            [
                'nom' => 'AZELIS',
                'adresse' => 'Avenue Jean Monnet 1, 1348 Louvain-la-Neuve, Belgique',
                'email' => 'info@azelis.com',
                'tel' => '+32 10 48 18 18'
            ],
            [
                'nom' => 'Univar',
                'adresse' => '3075 Highland Parkway, Downers Grove, IL 60515, États-Unis',
                'email' => 'info@univarsolutions.com',
                'tel' => '+1 630 879 2000'
            ],
            [
                'nom' => 'MASSO',
                'adresse' => '31 Rue des Fusillés, 94400 Vitry-sur-Seine, France',
                'email' => 'contact@masso.fr',
                'tel' => '+33 1 46 82 45 45'
            ],
            [
                'nom' => 'SAFIC ALCAN',
                'adresse' => '4 Rue Euryale Dehaynin, 75019 Paris, France',
                'email' => 'info@safic-alcan.com',
                'tel' => '+33 1 53 35 37 00'
            ]
        ];

        foreach ($fournisseurs as $index => $data) {
            $fournisseur = new Fournisseur();
            $fournisseur->setNomEntr($data['nom']);
            $fournisseur->setAdresse($data['adresse']);
            $fournisseur->setEmailGen($data['email']);
            $fournisseur->setTelFourni($data['tel']);
            
            $manager->persist($fournisseur);
            
            // pour utiliser dans d'autres fixtures pour remplir les cle etrangere ecriture de fournisseur_2 ou 3 ou...
            $this->addReference('fournisseur_' . $index, $fournisseur);
        }

        $manager->flush();
    }
}
