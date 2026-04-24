<?php

namespace App\DataFixtures;

use App\Entity\Document;
use App\Entity\Lot;
use App\Entity\MatPremiere;
use App\Entity\Fournisseur;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class DocumentFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Récupération des références créées par les fixtures dépendantes
        $lot1 = $this->getReference('lot_0', Lot::class); // premier lot créé dans LotFixtures
        $mp1 = $this->getReference('mp_0', MatPremiere::class);
        $fournisseur1 = $this->getReference('fournisseur_0', Fournisseur::class);

        // Document pour un lot
        $doc1 = new Document();
        $doc1->setNomFile('certificat_analyse_12345.pdf');
        $doc1->setType('certificat_analyse');
        $doc1->addLot($lot1);
        $manager->persist($doc1);

        // Document pour une MP
        $doc2 = new Document();
        $doc2->setNomFile('FT_argan.pdf');
        $doc2->setType('fiche_technique');
        $doc2->addMatiere($mp1);
        $manager->persist($doc2);

        // Document pour un fournisseur
        $doc3 = new Document();
        $doc3->setNomFile('ISO_9001.pdf');
        $doc3->setType('certificat_qualite');
        $doc3->addFournisseur($fournisseur1);
        $manager->persist($doc3);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            LotFixtures::class,           // Pour lot_0
            MatpremieresFixtures::class,  // Pour mp_0
            FournisseurFixtures::class,   // Pour fournisseur_0
        ];
    }
}