<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Distribution;
use App\Entity\Fournisseur;
use App\DataFixtures\FournisseurFixtures;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class DistributionFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);

        // distributions appartient a un fournisseur
        $distributions= [ 
             // CRODA (fournisseur_0)
            ['fournisseur_ref' => 'fournisseur_0', 'nom_marque' => 'Crodamol'],
            ['fournisseur_ref' => 'fournisseur_0', 'nom_marque' => 'Crodafos'],
            ['fournisseur_ref' => 'fournisseur_0', 'nom_marque' => 'Cromollient'],
            ['fournisseur_ref' => 'fournisseur_0', 'nom_marque' => 'Crothix'],
            
            // BASF (fournisseur_1)
            ['fournisseur_ref' => 'fournisseur_1', 'nom_marque' => 'CareCreations'],
            ['fournisseur_ref' => 'fournisseur_1', 'nom_marque' => 'Cetiol'],
            ['fournisseur_ref' => 'fournisseur_1', 'nom_marque' => 'Luvitol'],
            ['fournisseur_ref' => 'fournisseur_1', 'nom_marque' => 'Myritol'],
            
            // Givaudan (fournisseur_2)
            ['fournisseur_ref' => 'fournisseur_2', 'nom_marque' => 'GivClear'],
            ['fournisseur_ref' => 'fournisseur_2', 'nom_marque' => 'GivSafe'],
            ['fournisseur_ref' => 'fournisseur_2', 'nom_marque' => 'Givobio'],
            
            // Symrise (fournisseur_3)
            ['fournisseur_ref' => 'fournisseur_3', 'nom_marque' => 'Dragoxat'],
            ['fournisseur_ref' => 'fournisseur_3', 'nom_marque' => 'SymSol'],
            ['fournisseur_ref' => 'fournisseur_3', 'nom_marque' => 'SymClariol'],
            
            // Gattefossé (fournisseur_4)
            ['fournisseur_ref' => 'fournisseur_4', 'nom_marque' => 'Gattebase'],
            ['fournisseur_ref' => 'fournisseur_4', 'nom_marque' => 'Emulium'],
            ['fournisseur_ref' => 'fournisseur_4', 'nom_marque' => 'Apifil'],
            
            // Seppic (fournisseur_5)
            ['fournisseur_ref' => 'fournisseur_5', 'nom_marque' => 'Sepilift'],
            ['fournisseur_ref' => 'fournisseur_5', 'nom_marque' => 'Sepimat'],
            ['fournisseur_ref' => 'fournisseur_5', 'nom_marque' => 'Sepinov'],
            
            // Clariant (fournisseur_7)
            ['fournisseur_ref' => 'fournisseur_7', 'nom_marque' => 'Hostapon'],
            ['fournisseur_ref' => 'fournisseur_7', 'nom_marque' => 'Glucamate'],
            ['fournisseur_ref' => 'fournisseur_7', 'nom_marque' => 'Aristoflex'],
            
            // Evonik (fournisseur_8)
            ['fournisseur_ref' => 'fournisseur_8', 'nom_marque' => 'Tego'],
            ['fournisseur_ref' => 'fournisseur_8', 'nom_marque' => 'Abil'],
            ['fournisseur_ref' => 'fournisseur_8', 'nom_marque' => 'Rewoderm'],
            
            // Ashland (fournisseur_9)
            ['fournisseur_ref' => 'fournisseur_9', 'nom_marque' => 'Aquaflex'],
            ['fournisseur_ref' => 'fournisseur_9', 'nom_marque' => 'Sensomer'],
            ['fournisseur_ref' => 'fournisseur_9', 'nom_marque' => 'Benecel'],
            
            // Cargill (fournisseur_10)
            ['fournisseur_ref' => 'fournisseur_10', 'nom_marque' => 'Sensient'],
            ['fournisseur_ref' => 'fournisseur_10', 'nom_marque' => 'Acticol'],
            ['fournisseur_ref' => 'fournisseur_10', 'nom_marque' => 'Wheat Pro'],
            
            // Floratech (fournisseur_11)
            ['fournisseur_ref' => 'fournisseur_11', 'nom_marque' => 'Florasomes'],
            ['fournisseur_ref' => 'fournisseur_11', 'nom_marque' => 'Floraspheres'],
            ['fournisseur_ref' => 'fournisseur_11', 'nom_marque' => 'Floraceuticals'],
            
            // AAK (fournisseur_12)
            ['fournisseur_ref' => 'fournisseur_12', 'nom_marque' => 'Lipex'],
            ['fournisseur_ref' => 'fournisseur_12', 'nom_marque' => 'Akoline'],
            ['fournisseur_ref' => 'fournisseur_12', 'nom_marque' => 'Akosoft'],
            
            // KOSTER (fournisseur_13)
            ['fournisseur_ref' => 'fournisseur_13', 'nom_marque' => 'Kosteran'],
            ['fournisseur_ref' => 'fournisseur_13', 'nom_marque' => 'Koster Emollients'],
            
            // Sun Chemical (fournisseur_14)
            ['fournisseur_ref' => 'fournisseur_14', 'nom_marque' => 'SunPUFE'],
            ['fournisseur_ref' => 'fournisseur_14', 'nom_marque' => 'SunCROMA'],
            
            // Merck (fournisseur_15)
            ['fournisseur_ref' => 'fournisseur_15', 'nom_marque' => 'RonaCare'],
            ['fournisseur_ref' => 'fournisseur_15', 'nom_marque' => 'Eusolex'],
            
            // CP Kelco (fournisseur_16)
            ['fournisseur_ref' => 'fournisseur_16', 'nom_marque' => 'KELTROL'],
            ['fournisseur_ref' => 'fournisseur_16', 'nom_marque' => 'GENU'],
            
            // Daito Kasei (fournisseur_17)
            ['fournisseur_ref' => 'fournisseur_17', 'nom_marque' => 'Daitosol'],
            
            // Jungbunzlauer (fournisseur_18)
            ['fournisseur_ref' => 'fournisseur_18', 'nom_marque' => 'Jungbunzlauer'],
            
            // Stéarinerie (fournisseur_19)
            ['fournisseur_ref' => 'fournisseur_19', 'nom_marque' => 'Stearine'],
            
            // Carilène (fournisseur_20)
            ['fournisseur_ref' => 'fournisseur_20', 'nom_marque' => 'Carilène'],
            
            // Vantage (fournisseur_21)
            ['fournisseur_ref' => 'fournisseur_21', 'nom_marque' => 'Vantage'],
            
            // Sollice (fournisseur_22)
            ['fournisseur_ref' => 'fournisseur_22', 'nom_marque' => 'Sollice'],
            
            // Verfilcos (fournisseur_23)
            ['fournisseur_ref' => 'fournisseur_23', 'nom_marque' => 'Verfilcos'],
            
            // Distributeurs - ils ont aussi leurs marques
            // AZELIS (fournisseur_24)
            ['fournisseur_ref' => 'fournisseur_24', 'nom_marque' => 'Azelis Care'],
            ['fournisseur_ref' => 'fournisseur_24', 'nom_marque' => 'Azelis Specialty'],
            
            // Univar (fournisseur_25)
            ['fournisseur_ref' => 'fournisseur_25', 'nom_marque' => 'Univar Solutions'],
            ['fournisseur_ref' => 'fournisseur_25', 'nom_marque' => 'Univar Specialty'],
            
            // MASSO (fournisseur_26)
            ['fournisseur_ref' => 'fournisseur_26', 'nom_marque' => 'MASSO Ingredients'],
            
            // SAFIC ALCAN (fournisseur_27)
            ['fournisseur_ref' => 'fournisseur_27', 'nom_marque' => 'SAFIC'],
            ['fournisseur_ref' => 'fournisseur_27', 'nom_marque' => 'ALCAN']
        ];

        foreach ($distributions as $index => $data) {
            $distribution = new Distribution();
            $distribution->setNomMarque($data['nom_marque']);
            
            $fournisseur = $this->getReference($data['fournisseur_ref' ], Fournisseur::class);
            $distribution->setFournisseur($fournisseur);
            
            $manager->persist($distribution);
            
            // Référence optionnelle pour d'autres fixtures
            $this->addReference('distribution_' . $index, $distribution);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            FournisseurFixtures::class, // Distribution dépend de Fournisseur
        ];
    }
}
