<?php

namespace App\DataFixtures;

use App\Entity\Distribue;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use App\Entity\Distribution;
use App\Entity\MatPremiere;
use App\Entity\ContactFournisseur;

class DistribueFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);

        $distribues=[
            [# croda (fournisseur_0 )
                'distribution_ref' => 'distribution_0', # crodamol
                'mp_ref' => 'mp_0', # daraquench IQ
                'contact_ref' => 'contact_0' # jean dupont
            ],
            [
                'distribution_ref' => 'distribution_1', // Crodafos
                'mp_ref' => 'mp_0',                     // Darquench IQ
                'contact_ref' => 'contact_1'             // Sophie Martin
            ],
            [
                'distribution_ref' => 'distribution_1',
                'mp_ref' => 'mp_3',                     // Acétate DL-Alpha-Tocophérol
                'contact_ref' => 'contact_1'
            ],
            [
                'distribution_ref' => 'distribution_1',
                'mp_ref' => 'mp_4',                     // Acid citric anhydrous
                'contact_ref' => 'contact_1'
            ],
            [# cromollient  (distribution_2 )
                'distribution_ref' => 'distribution_2', # cromollient
                'mp_ref' => 'mp_5', # acide citrique monohydrate
                'contact_ref' => null # nul
            ],
            [
                'distribution_ref' => 'distribution_4', // CareCreations
                'mp_ref' => 'mp_7',                     // Acide hyaluronique
                'contact_ref' => 'contact_2'             // Hans Schmidt
            ],
            [
                'distribution_ref' => 'distribution_5', // Cetiol
                'mp_ref' => 'mp_9',                     // Acide salicylique
                'contact_ref' => 'contact_3'             // Anna Weber
            ],
            [
                'distribution_ref' => 'distribution_5',
                'mp_ref' => 'mp_10',                    // Acide stéarique
                'contact_ref' => 'contact_3'
            ],
            [
                'distribution_ref' => 'distribution_7', // GivClear
                'mp_ref' => 'mp_4',                     // Acid citric anhydrous
                'contact_ref' => 'contact_4'             // Pierre Dubois
            ],
             [
                'distribution_ref' => 'distribution_31', // Lipex
                'mp_ref' => 'mp_1',                      // 1,2-Propylene Glycol
                'contact_ref' => null
            ]

        ];

        $index = 0;
        foreach($distribues as $data){
            $distribue = new Distribue();
            # distribution
            $distribution = $this->getReference($data['distribution_ref'], Distribution::class);
            $distribue->setDistribution($distribution);
            
            # MP (obligatoire)
            $mp = $this->getReference($data['mp_ref'], MatPremiere::class);
            $distribue->setMp($mp);
            
            # Contact (optionnel)
            if ($data['contact_ref']) {
                $contact = $this->getReference($data['contact_ref'], ContactFournisseur::class);
                $distribue->setContact($contact);
            }
            
            $manager->persist($distribue);
            
            $this->addReference('distribue_' . $index, $distribue);
            $index++;
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            DistributionFixtures::class,
            MatpremieresFixtures::class,
            ContactFournisseurFixtures::class,
        ];
    }
}
