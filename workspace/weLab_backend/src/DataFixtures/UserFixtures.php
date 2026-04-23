<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;



class UserFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }
    public function load(ObjectManager $manager): void{
        // 1. Créer un utilisateur simple (ROLE_USER)
        $user = new User();
        $user->setEmail('user@example.com');
        $user->setNom('Dupont');
        $user->setPrenom('Jean');
        $user->setRoles(['ROLE_USER']); // Le rôle ROLE_USER sera ajouté automatiquement par getRoles()
        $hashedPassword = $this->passwordHasher->hashPassword($user, 'password123');
        $user->setPassword($hashedPassword);
        $manager->persist($user);


// Exécution
        $manager->flush();
    }
    
}