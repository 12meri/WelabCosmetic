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
