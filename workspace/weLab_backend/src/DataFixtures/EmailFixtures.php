<?php

namespace App\DataFixtures;

use App\Entity\Email;
use App\Entity\DemandeEchantillon;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class EmailFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Récupération de la première demande d'échantillon (celle avec référence 'demande_0')
        $demande = $this->getReference('demande_0', DemandeEchantillon::class);

        $email = new Email();
        $email->setSujet('Demande d\'échantillon');
        $email->setTxt('Bonjour, pourriez-vous nous envoyer un échantillon de ...');
        $email->setDateEnvoie(new \DateTime());
        $email->setDemandeEchantillon($demande);
        $manager->persist($email);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            DemandeEchantillonFixtures::class,
        ];
    }
}