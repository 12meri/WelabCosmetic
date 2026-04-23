<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use App\DataFixtures\MatpremieresFixtures;
use App\DataFixtures\DemandeEchantillonFixtures;
use App\Entity\Lot;
use App\Entity\MatPremiere;
use App\Entity\DemandeEchantillon;
use DateTime;

class LotFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);

    $lots=[
        [
                'mp_ref' => 'mp_0',           // Darquench IQ SA MBAL-PA-(RB)
                'numLot' => 'HA-2024-001',
                'dateArrivee' => new DateTime('2024-01-15'),
                'ddm' => new DateTime('2026-01-15'),
                'qtInitiale' => 25.0,
                'qtRestante' => 18.5,
                'qtMin' => 5.0,
                'etat' => 'OK',
                'demande_ref' => null
            ],
            [
                'mp_ref' => 'mp_0', // Darquench IQ SA MBAL-PA-(RB)
                'numLot' => 'HA-2024-002',
                'dateArrivee' => new DateTime('2024-06-20'),
                'ddm' => new DateTime('2026-06-20'),
                'qtInitiale' => 30.0,
                'qtRestante' => 30.0,
                'qtMin' => 5.0,
                'etat' => 'OK',
                'demande_ref' => null
            ],
            [
                'mp_ref' => 'mp_1',           // 1,2-Propylene Glycol care
                'numLot' => 'BK-2024-001',
                'dateArrivee' => new DateTime('2024-02-10'),
                'ddm' => new DateTime('2025-08-10'),
                'qtInitiale' => 50.0,
                'qtRestante' => 12.0,
                'qtMin' => 10.0,
                'etat' => 'ALERTE',             // Stock bas !
                'demande_ref' => null
            ],
            [
                'mp_ref' => 'mp_7',           // Acide Hyaluronique
                'numLot' => 'AH-2024-001',
                'dateArrivee' => new DateTime('2024-01-20'),
                'ddm' => new DateTime('2025-01-20'),
                'qtInitiale' => 5.0,
                'qtRestante' => 0.0,
                'qtMin' => 1.0,
                'etat' => 'EPUISE',             // Épuisé
                'demande_ref' => null
            ],
             [
                'mp_ref' => 'mp_4',           // Acid citric anhydrous
                'numLot' => 'AC-2023-001',
                'dateArrivee' => new DateTime('2023-11-15'),
                'ddm' => new DateTime('2024-06-15'), // DDM dans 3 mois
                'qtInitiale' => 20.0,
                'qtRestante' => 15.0,
                'qtMin' => 5.0,
                'etat' => 'ALERTE',             // DDM proche !
                'demande_ref' => null
            ],
             [
                'mp_ref' => 'mp_3',           // Acétate DL-Alpha-Tocophérol
                'numLot' => 'VIT-2024-001',
                'dateArrivee' => new DateTime('2024-08-01'),
                'ddm' => new DateTime('2025-08-01'),
                'qtInitiale' => 2.0,
                'qtRestante' => 2.0,
                'qtMin' => 0.5,
                'etat' => 'OK',
                'demande_ref' => null    // Référence vers une demande
            ],
    ];

    foreach($lots as $index => $data){
        $lot = new Lot();

        $mp = $this->getReference($data['mp_ref'], MatPremiere::class);
        $lot->setMp($mp);

        $lot->setNumLot($data['numLot']);
        $lot->setDateArrivee($data['dateArrivee']);
        $lot->setDdm($data['ddm']);
        $lot->setQtInitiale((string) $data['qtInitiale']);
        $lot->setQtRestante((string) $data['qtRestante']);
        $lot->setQtMin((string) $data['qtMin']);
        $lot->setEtat($data['etat']);
        $lot->setDateMaj($data['dateArrivee']);

        // pour demandechantillon si existe
        if (isset($data['demande_ref']) && $data['demande_ref']) {
                $demande = $this->getReference($data['demande_ref'], DemandeEchantillon::class);
                $lot->setDemandeEchantillon($demande);
            }

        $manager->persist($lot);

        $this->addReference('lot_'.$index,$lot);
    }

        $manager->flush();
    }
    public function getDependencies(): array // cette méthode est requise par l'interface DependentFixtureInterface et doit retourner un tableau des classes de fixtures dont cette fixture dépend, c'est-à-dire les fixtures qui doivent être chargées avant celle-ci pour que les références utilisées dans cette fixture soient disponibles
    {
        return [
            MatpremieresFixtures::class, // on dépend des fixtures des matières premières car les lots doivent être associés à des matières premières qui doivent déjà exister en base de données pour que les références fonctionnent, sinon on aurait une erreur de référence non trouvée lors du chargement des fixtures des lots
            //DemandeEchantillonFixtures::class,
        ];
    }
}
