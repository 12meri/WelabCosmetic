<?php

namespace App\DataFixtures;

use App\Entity\Stagiaire;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class StagiaireFixtures extends Fixture
{
    public function __construct(private UserPasswordHasherInterface $hasher) {}

    public function load(ObjectManager $manager): void
    {
        $stagiaire = new Stagiaire();
        $stagiaire->setEmail('stagiaire@example.com');
        $stagiaire->setNom('Martin');
        $stagiaire->setPrenom('Lucas');
        $stagiaire->setRoles(['ROLE_STAGIAIRE']);
        $stagiaire->setPassword($this->hasher->hashPassword($stagiaire, 'stage123'));
        // Champs spécifiques
        $stagiaire->setDebutStage(new \DateTime('2025-06-01'));
        $stagiaire->setFinStage(new \DateTime('2025-08-31'));
        $stagiaire->setFonction('Développeur');

        $manager->persist($stagiaire);
        $manager->flush();
    }
}