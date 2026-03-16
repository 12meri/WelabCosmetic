<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use App\Entity\Alerte;
use App\Entity\Lot;
use App\Entity\DemandeEchantillon;
use DateTime;

class AlerteFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);
        $alertes = [[
            'lot_ref'=>'lot_1' ,// lot1 dans lotfixtures
            'type'=> 'STOCK_BAS',
            'etat'=>'ACTIVE',
            'message'=> 'Stock bas pour le lot BK-2024-001 : restante=9.0 < min=10.0',
            'dateAlerte'=> new DateTime('2025-02-15 10:30:00'),
        ],
        [
            'lot_ref' => 'lot_2',           // Aloe Vera (lot_2)
            'type' => 'STOCK_BAS',
            'etat' => 'ACTIVE',
            'message' => 'Stock bas pour le lot AV-2024-001 : restante=5.5 < min=8.0',
            'dateAlerte' => new DateTime('2025-02-20 14:45:00'),
        ],
        [
            'lot_ref' => 'lot_4',           // Acid citric anhydrous (lot_4)
            'type' => 'DDM_PROCHE',
            'etat' => 'ACTIVE',
            'message' => 'DDM proche pour le lot AC-2023-001 : expire le 2024-06-15',
            'dateAlerte' => new DateTime('2024-05-15 09:00:00'),
        ],
        [
            'lot_ref' => 'lot_0',           // Huile d'Argan (lot_0)
            'type' => 'STOCK_BAS',
            'etat' => 'TRAITEE',
            'message' => 'Stock bas pour le lot HA-2024-001 : restante=18.5 < min=5.0',
            'dateAlerte' => new DateTime('2025-01-10 11:20:00'),
        ],
        [
            'lot_ref' => 'lot_5',           // VIT-2024-001 (lot_5)
            'type' => 'DDM_PROCHE',
            'etat' => 'TRAITEE',
            'message' => 'DDM proche pour le lot VIT-2024-001 : expire le 2025-08-01',
            'dateAlerte' => new DateTime('2025-06-01 16:30:00'),
        ],
        [
            'lot_ref' => 'lot_3',           // Acide Hyaluronique épuisé (lot_3)
            'type' => 'PERIME',
            'etat' => 'IGNOREE',
            'message' => 'Lot AH-2024-001 périmé depuis le 2025-01-20',
            'dateAlerte' => new DateTime('2025-01-21 08:15:00'),
            
        ],
        [
            'lot_ref' => 'lot_2',           // Aloe Vera
            'type' => 'DDM_PROCHE',
            'etat' => 'ACTIVE',
            'message' => 'DDM proche pour le lot AV-2024-001 : expire le 2025-09-05',
            'dateAlerte' => new DateTime('2025-07-01 13:45:00'),
            
        ]
        
        ];
        
        foreach ($alertes as $index => $data) {
                    $alerte = new Alerte();
                    
                    // Lot (obligatoire)
                    $lot = $this->getReference($data['lot_ref'], Lot::class);
                    $alerte->setLot($lot);
                    
                    // Type d'alerte
                    $alerte->setTypeAlerte($data['type']);
                    $alerte->setEtatAlerte($data['etat']);
                    $alerte->setMessage($data['message']);
                    $alerte->setDateAlerte($data['dateAlerte']);
                    
                    
                    
                    $manager->persist($alerte);
                    
                    // Référence pour d'autres fixtures
                    $this->addReference('alerte_' . $index, $alerte);
                }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            LotFixtures::class,
        ];
    }
}
