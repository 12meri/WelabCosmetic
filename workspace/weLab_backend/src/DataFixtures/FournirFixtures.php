<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use App\Entity\Fournir;
use App\Entity\MatPremiere;
use App\Entity\Fournisseur;
use App\Entity\Distribution;

class FournirFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);

        # distribution peut etre null si ya prix direct sinon si speciale pour une certaine marque il sera prise en compte 
        $catalogue = [
            #  CRODA (fournisseur_0) 
            # Darquench IQ (mp_0)
            [
                'mp_ref' => 'mp_0',           # Darquench IQ
                'fournisseur_ref' => 'fournisseur_0', # CRODA
                'distribution_ref' => null,
                'prix' => 45.50,
                'moq' => 10.0
            ],
            # Darquench IQ via Crodamol (distribution_0)
            [
                'mp_ref' => 'mp_0',
                'fournisseur_ref' => 'fournisseur_0',
                'distribution_ref' => 'distribution_0', // Crodamol
                'prix' => 52.00,
                'moq' => 5.0
            ],
            
           # 1,2-Propylene Glycol (mp_1) 
            [
                'mp_ref' => 'mp_1',           # 1,2-Propylene Glycol
                'fournisseur_ref' => 'fournisseur_0',
                'distribution_ref' => null,
                'prix' => 28.50,
                'moq' => 25.0
            ],
            
            // BASF (fournisseur_1) 
            // Acacia gomme (mp_2) - Prix direct
            [
                'mp_ref' => 'mp_2',           // Acacia gomme
                'fournisseur_ref' => 'fournisseur_1', // BASF
                'distribution_ref' => null,
                'prix' => 32.00,
                'moq' => 15.0
            ],
            
            # Acétate DL-Alpha-Tocophérol (mp_3) - Prix direct
            [
                'mp_ref' => 'mp_3',           // Acétate DL-Alpha-Tocophérol
                'fournisseur_ref' => 'fournisseur_1',
                'distribution_ref' => null,
                'prix' => 67.30,
                'moq' => 5.0
            ],
            // Acétate via CareCreations (distribution_4)
            [
                'mp_ref' => 'mp_3',
                'fournisseur_ref' => 'fournisseur_1',
                'distribution_ref' => 'distribution_4', // CareCreations
                'prix' => 72.50,
                'moq' => 3.0
            ],
            
            //  Givaudan (fournisseur_2) 
            // Acid citric anhydrous (mp_4) - Prix direct
            [
                'mp_ref' => 'mp_4',           // Acid citric anhydrous
                'fournisseur_ref' => 'fournisseur_2', // Givaudan
                'distribution_ref' => null,
                'prix' => 18.90,
                'moq' => 20.0
            ],
            
            // Acide citrique monohydraté (mp_5) - Prix direct
            [
                'mp_ref' => 'mp_5',           // Acide citrique monohydraté
                'fournisseur_ref' => 'fournisseur_2',
                'distribution_ref' => null,
                'prix' => 19.50,
                'moq' => 20.0
            ],
            
            //  Gattefossé (fournisseur_4)
            // Acide de fleurs COS (mp_6) - Prix direct
            [
                'mp_ref' => 'mp_6',           // Acide de fleurs COS
                'fournisseur_ref' => 'fournisseur_4', // Gattefossé
                'distribution_ref' => null,
                'prix' => 42.00,
                'moq' => 5.0
            ],
            // Acide de fleurs via Gattebase (distribution_11)
            [
                'mp_ref' => 'mp_6',
                'fournisseur_ref' => 'fournisseur_4',
                'distribution_ref' => 'distribution_11', // Gattebase
                'prix' => 46.50,
                'moq' => 3.0
            ],
            
            // Seppic (fournisseur_5)
            // Acide hyaluronique (mp_7) - Prix direct
            [
                'mp_ref' => 'mp_7',           // Acide hyaluronique
                'fournisseur_ref' => 'fournisseur_5', // Seppic
                'distribution_ref' => null,
                'prix' => 125.00,
                'moq' => 1.0
            ],
            // Acide hyaluronique via Sepilift (distribution_14)
            [
                'mp_ref' => 'mp_7',
                'fournisseur_ref' => 'fournisseur_5',
                'distribution_ref' => 'distribution_14', // Sepilift
                'prix' => 145.00,
                'moq' => 0.5
            ],
            
            // Clariant (fournisseur_7) 
            // Acide lactique (mp_8) - Prix direct
            [
                'mp_ref' => 'mp_8',           // Acide lactique
                'fournisseur_ref' => 'fournisseur_7', // Clariant
                'distribution_ref' => null,
                'prix' => 23.50,
                'moq' => 15.0
            ],
            
            //  Evonik (fournisseur_8) 
            // Acide salicylique (mp_9) - Prix direct
            [
                'mp_ref' => 'mp_9',           // Acide salicylique
                'fournisseur_ref' => 'fournisseur_8', // Evonik
                'distribution_ref' => null,
                'prix' => 34.20,
                'moq' => 10.0
            ],
            
            // Acitrice MB (mp_11) - Prix direct
            [
                'mp_ref' => 'mp_11',          // Acitrice MB
                'fournisseur_ref' => 'fournisseur_9',
                'distribution_ref' => null,
                'prix' => 31.50,
                'moq' => 12.0
            ],
            
            // avec prix non définis 
            // Nouvelle relation sans prix (juste pour lier)
            [
                'mp_ref' => 'mp_2',           // Acacia gomme
                'fournisseur_ref' => 'fournisseur_10', // Cargill
                'distribution_ref' => null,
                'prix' => null,
                'moq' => null
            ],
            
            // Acide hyaluronique chez un autre fournisseur (prix à définir)
            [
                'mp_ref' => 'mp_7',           // Acide hyaluronique
                'fournisseur_ref' => 'fournisseur_11', // Floratech
                'distribution_ref' => null,
                'prix' => null,
                'moq' => null
            ]
        ];

        $index = 0;
        foreach ($catalogue as $data) {
            $fournir = new Fournir();
            
            // Récupérer la MP
            $mp = $this->getReference($data['mp_ref'], MatPremiere::class);
            $fournir->setMatPrem($mp);
            
            // Récupérer le fournisseur
            $fournisseur = $this->getReference($data['fournisseur_ref'], Fournisseur::class);
            $fournir->setFournisseur($fournisseur);
            
            // Récupérer la distribution (si existe)
            if ($data['distribution_ref']) {
                $distribution = $this->getReference($data['distribution_ref'], Distribution::class);
                $fournir->setDistribution($distribution);
            }
            
            // Prix et MOQ (peuvent être null)
            $fournir->setPrix($data['prix'] ? (string) $data['prix'] : null);
            $fournir->setMoq($data['moq'] ? (string) $data['moq'] : null);
            
            $manager->persist($fournir);
            
            $this->addReference('fournir_' . $index, $fournir);
            $index++;
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            MatpremieresFixtures::class,
            FournisseurFixtures::class,
            DistributionFixtures::class,
        ];
    }

     
}
