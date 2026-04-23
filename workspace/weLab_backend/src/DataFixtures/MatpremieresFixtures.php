<?php

namespace App\DataFixtures;

use App\Entity\MatPremiere;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class MatpremieresFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $mpData = [
            // MP, INCI, Catégorie, Fonction, Cosmos // TODO ajouter NOI
            [
                'nom' => 'Darquench IQ SA MBAL-PA-(RB)',
                'inci' => 'Cedyl Alcohol/andil isostearal isostearate (andil)',
                'categorie' => 'A',
                'fonction' => 'Tensionnant, mousseur, détergent',
                'cosmos' => 'OUI'
            ],
            [
                'nom' => '1,2-Propylene Glycol care',
                'inci' => 'Propylene glycol',
                'categorie' => 'P',
                'fonction' => 'Solvant - Filmogène - Hydratant - Adoucissant',
                'cosmos' => 'OUI'
            ],
            [
                'nom' => 'Acacia gomme',
                'inci' => 'Acacia senegal gum',
                'categorie' => 'A',
                'fonction' => 'Gélifiant - Tensionneur - Stabilisateur d\'émulsions',
                'cosmos' => 'OUI'
            ],
            [
                'nom' => 'Acétate DL-Alpha-Tocophérol',
                'inci' => 'Vitamin E acetate',
                'categorie' => 'A',
                'fonction' => 'Antioxydant - Protecteur cutané',
                'cosmos' => 'OUI'
            ],
            [
                'nom' => 'Acid citric anhydrous',
                'inci' => 'Citric acid',
                'categorie' => 'A',
                'fonction' => 'Régulateur de pH',
                'cosmos' => 'OUI'
            ],
            [
                'nom' => 'Acide citrique monohydraté',
                'inci' => 'Citric acid',
                'categorie' => 'A',
                'fonction' => 'Régulateur pH',
                'cosmos' => 'OUI'
            ],
            [
                'nom' => 'Acide de fleurs COS (SB)',
                'inci' => 'Agua (andil) Hibiscus Sabdariffa Flower Extract (andil)',
                'categorie' => 'A',
                'fonction' => 'Actif kératolytique',
                'cosmos' => 'OUI'
            ],
            [
                'nom' => 'Acide hyaluronique',
                'inci' => 'Sodium hyaluronate',
                'categorie' => 'A',
                'fonction' => 'Hydratant - Repulpant',
                'cosmos' => 'OUI'
            ],
            [
                'nom' => 'Acide lactique',
                'inci' => 'Lactose',
                'categorie' => 'A',
                'fonction' => 'Régulateur de pH - Humectant - Agent kératolytique',
                'cosmos' => 'OUI'
            ],
            [
                'nom' => 'Acide salicylique',
                'inci' => 'Salicylic acid',
                'categorie' => 'A',
                'fonction' => 'Agent kératolytique (anti-pelliculaire)',
                'cosmos' => 'NON'
            ],
            [
                'nom' => 'Acide stéarique',
                'inci' => 'Stearic acid',
                'categorie' => 'A',
                'fonction' => 'Facteur de consistance',
                'cosmos' => 'OUI'
            ],
            [
                'nom' => 'Acitrice MB',
                'inci' => 'Lactic acid',
                'categorie' => 'A',
                'fonction' => 'Facteur de consistance, régulateur',
                'cosmos' => 'OUI'
            ],
            // Ajoute les autres que tu as mentionnés
            // [
            //     'nom' => 'Beurre de Karité',
            //     'inci' => 'Butyrospermum parkii butter',
            //     'categorie' => 'Beurre',
            //     'fonction' => 'Émollient - Nourrissant',
            //     'cosmos' => 'OUI'
            // ],
            // [
            //     'nom' => 'Huile d\'Argan',
            //     'inci' => 'Argania spinosa kernel oil',
            //     'categorie' => 'Huile',
            //     'fonction' => 'Nourrissante - Protectrice',
            //     'cosmos' => 'OUI'
            // ],
            // [
            //     'nom' => 'Aloe Vera',
            //     'inci' => 'Aloe barbadensis leaf juice',
            //     'categorie' => 'Gel',
            //     'fonction' => 'Apaisant - Hydratant',
            //     'cosmos' => 'OUI'
            // ],
            // [
            //     'nom' => 'Huile de Coco',
            //     'inci' => 'Cocos nucifera oil',
            //     'categorie' => 'Huile',
            //     'fonction' => 'Émollient - Nourrissant',
            //     'cosmos' => 'OUI'
            // ],
            // [
            //     'nom' => 'Argile Verte',
            //     'inci' => 'Illite',
            //     'categorie' => 'Poudre',
            //     'fonction' => 'Absorbant - Purifiant',
            //     'cosmos' => 'OUI'
            // ],
            // [
            //     'nom' => 'Vitamine E',
            //     'inci' => 'Tocopherol',
            //     'categorie' => 'Actif',
            //     'fonction' => 'Antioxydant',
            //     'cosmos' => 'OUI'
            // ]
        ];

        foreach ($mpData as $index => $data) {
            $mp = new MatPremiere();
            $mp->setNomMp($data['nom']);
            $mp->setInci($data['inci']);
            $mp->setCategorie($data['categorie']);
            $mp->setFonction($data['fonction']);
            $mp->setCosmos($data['cosmos']);
            
            // Quelques valeurs par défaut pour les champs optionnels
            $mp->setNoi(number_format(mt_rand(0, 100) / 100, 2)); // À remplacer par de vraies valeurs si disponibles
            
            $manager->persist($mp);
            $this->addReference('mp_' . $index, $mp); // on ajoute une référence pour pouvoir associer les lots à ces matières premières dans les fixtures des lots
        }

        $manager->flush(); // on enregistre les matières premières en base de données
    }
}
