<?php

namespace App\DataFixtures;

use App\Entity\Administrateur;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AdministrateurFixtures extends Fixture
{
    public function __construct(private UserPasswordHasherInterface $hasher) {}

    public function load(ObjectManager $manager): void
    {
        $admin = new Administrateur();
        $admin->setEmail('admin@example.com');
        $admin->setNom('Dupont');
        $admin->setPrenom('Alice');
        $admin->setRoles(['ROLE_ADMIN']); // Pas besoin de ROLE_USER
        $admin->setPassword($this->hasher->hashPassword($admin, 'admin123'));

        $manager->persist($admin);
        $manager->flush();
    }
}