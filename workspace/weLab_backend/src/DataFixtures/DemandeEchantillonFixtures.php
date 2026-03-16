<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use App\Entity\DemandeEchantillon;
use App\Entity\Fournisseur;
use App\Entity\Lot;
use App\Entity\Alerte;
use App\Entity\MatPremiere;
// use App\Entity\Alerte; // À décommenter plus tard
// use App\Entity\Utilisateur; // À décommenter plus tard
use DateTime;

class DemandeEchantillonFixtures extends Fixture  implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void 
    {
        // $product = new Product();
        // $manager->persist($product);

        
        $demandes = [
            
            [
                'fournisseur_ref' => 'fournisseur_0', // CRODA
                'mp_ref' => 'mp_0',                   // Darquench IQ
                'dateDemande' => new DateTime('2025-02-15'),
                'delaiLivraison' => new DateTime('2025-03-15'),
                'etat' => 'EN_COURS',
                                   
            ],
            [
                'fournisseur_ref' => 'fournisseur_0', // CRODA
                'mp_ref' => 'mp_1',                   // 1,2-Propylene Glycol
                'dateDemande' => new DateTime('2025-02-20'),
                'delaiLivraison' => new DateTime('2025-03-20'),
                'etat' => 'EN_COURS',
               
            ],
            
            // ========== Demandes envoyées ==========
            [
                'fournisseur_ref' => 'fournisseur_1', // BASF
                'mp_ref' => 'mp_7',                   // Acide hyaluronique
                'dateDemande' => new DateTime('2025-01-10'),
                'delaiLivraison' => new DateTime('2025-02-10'),
                'etat' => 'ENVOYE',
               
            ],
            
            // ========== Demandes reçues (avec lot lié) ==========
            [
                'fournisseur_ref' => 'fournisseur_2', // Givaudan
                'mp_ref' => 'mp_4',                   // Acid citric anhydrous
                'dateDemande' => new DateTime('2024-11-05'),
                'delaiLivraison' => new DateTime('2024-12-05'),
                'etat' => 'RECU',
                              
            ],
            [
                'fournisseur_ref' => 'fournisseur_4', // Gattefossé
                'mp_ref' => 'mp_6',                   // Acide de fleurs COS
                'dateDemande' => new DateTime('2024-10-15'),
                'delaiLivraison' => new DateTime('2024-11-15'),
                'etat' => 'RECU',
                'alerte_ref' => null,
                                   
            ],
            
            // Demandes refusées 
            [
                'fournisseur_ref' => 'fournisseur_7', // Clariant
                'mp_ref' => 'mp_8',                   // Acide lactique
                'dateDemande' => new DateTime('2024-12-01'),
                'delaiLivraison' => null,              // Pas de délai donné
                'etat' => 'REFUSE',
                'alerte_ref' => 'alerte_2',
              
            ],
            
            //  Demandes sans alerte (prospection) 
            [
                'fournisseur_ref' => 'fournisseur_10', // Cargill
                'mp_ref' => 'mp_2',                    // Acacia gomme
                'dateDemande' => new DateTime('2025-03-01'),
                'delaiLivraison' => new DateTime('2025-04-01'),
                'etat' => 'EN_COURS',
                'alerte_ref' => 'alerte_1',
               
            ],
            
            
            [
                'fournisseur_ref' => 'fournisseur_0',
                'mp_ref' => 'mp_0',
                'dateDemande' => new DateTime('2025-02-01'),
                'delaiLivraison' => new DateTime('2025-03-01'),
                'etat' => 'EN_COURS',
                'alerte_ref' => 'alerte_0',
               
            ],
            
        ];

        foreach ($demandes as $index => $data) {
            $demande = new DemandeEchantillon();
            
            // Date de demande (avec défaut si non spécifiée)
            $demande->setDateDemande($data['dateDemande'] ?? new DateTime());
            
            // État
            $demande->setEtat($data['etat']);
            
            // Délai de livraison (optionnel)
            if (isset($data['delaiLivraison'])) {
                $demande->setDelaiLivraison($data['delaiLivraison']);
            }
            
            // Fournisseur (obligatoire)
            $fournisseur = $this->getReference($data['fournisseur_ref'], Fournisseur::class);
            $demande->setFournisseur($fournisseur);
            
            // MP (obligatoire)
            $mp = $this->getReference($data['mp_ref'], MatPremiere::class);
            $demande->setMp($mp);
            
            // Alerte 
            
            if (isset($data['alerte_ref'])) {
                $alerte = $this->getReference($data['alerte_ref'], Alerte::class);
                $demande->setAlerte($alerte);
            }
            
            
            // Lien avec un lot
            if (isset($data['lot_ref']) && $data['lot_ref']) {
                $lot = $this->getReference($data['lot_ref'], Lot::class);
                $demande->addLot($lot);  // Le lot sera lié à cette demande
            }
            
            $manager->persist($demande);
            
            // Référence pour d'autres fixtures
            $this->addReference('demande_' . $index, $demande);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            FournisseurFixtures::class,
            MatpremieresFixtures::class,
            AlerteFixtures::class, // Quand Alerte existera
        ];
    }
}
