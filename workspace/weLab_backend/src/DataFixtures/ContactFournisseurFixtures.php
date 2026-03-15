<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use App\Entity\ContactFournisseur;
use App\Entity\Fournisseur;


class ContactFournisseurFixtures extends Fixture  implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);
$contacts = [
            // CRODA (fournisseur_0)
            ['fournisseur_ref' => 'fournisseur_0', 'nom' => 'Dupont', 'prenom' => 'Jean', 'fonction' => 'Commercial France', 'email' => 'j.dupont@croda.com', 'tel' => '+33 1 23 45 67 89'],
            ['fournisseur_ref' => 'fournisseur_0', 'nom' => 'Martin', 'prenom' => 'Sophie', 'fonction' => 'Support Technique', 'email' => 's.martin@croda.com', 'tel' => '+33 1 23 45 67 90'],
            
            // BASF (fournisseur_1)
            ['fournisseur_ref' => 'fournisseur_1', 'nom' => 'Schmidt', 'prenom' => 'Hans', 'fonction' => 'Account Manager', 'email' => 'h.schmidt@basf.com', 'tel' => '+49 621 123456'],
            ['fournisseur_ref' => 'fournisseur_1', 'nom' => 'Weber', 'prenom' => 'Anna', 'fonction' => 'Technical Support', 'email' => 'a.weber@basf.com', 'tel' => '+49 621 123457'],
            
            // Givaudan (fournisseur_2)
            ['fournisseur_ref' => 'fournisseur_2', 'nom' => 'Dubois', 'prenom' => 'Pierre', 'fonction' => 'Sales Director', 'email' => 'p.dubois@givaudan.com', 'tel' => '+33 4 72 34 56 78'],
            
            // Symrise (fournisseur_3)
            ['fournisseur_ref' => 'fournisseur_3', 'nom' => 'Müller', 'prenom' => 'Klaus', 'fonction' => 'Key Account Manager', 'email' => 'k.muller@symrise.com', 'tel' => '+49 5531 987654'],
            
            // Gattefossé (fournisseur_4)
            ['fournisseur_ref' => 'fournisseur_4', 'nom' => 'Bernard', 'prenom' => 'Marie', 'fonction' => 'Commerciale', 'email' => 'm.bernard@gattefosse.com', 'tel' => '+33 4 72 22 98 10'],
            ['fournisseur_ref' => 'fournisseur_4', 'nom' => 'Leroy', 'prenom' => 'Thomas', 'fonction' => 'Support Technique', 'email' => 't.leroy@gattefosse.com', 'tel' => '+33 4 72 22 98 11'],
            
            // Seppic (fournisseur_5)
            ['fournisseur_ref' => 'fournisseur_5', 'nom' => 'Petit', 'prenom' => 'Julie', 'fonction' => 'Commerciale', 'email' => 'j.petit@seppic.com', 'tel' => '+33 1 40 86 58 20'],
            
            // Soliance (fournisseur_6)
            ['fournisseur_ref' => 'fournisseur_6', 'nom' => 'Moreau', 'prenom' => 'Nicolas', 'fonction' => 'Ingénieur Commercial', 'email' => 'n.moreau@soliance.com', 'tel' => '+33 1 64 79 16 30'],
            
            // Clariant (fournisseur_7)
            ['fournisseur_ref' => 'fournisseur_7', 'nom' => 'Rochat', 'prenom' => 'Laurent', 'fonction' => 'Business Manager', 'email' => 'l.rochat@clariant.com', 'tel' => '+41 61 469 52 00'],
            
            // Evonik (fournisseur_8)
            ['fournisseur_ref' => 'fournisseur_8', 'nom' => 'Fischer', 'prenom' => 'Markus', 'fonction' => 'Technical Sales', 'email' => 'm.fischer@evonik.com', 'tel' => '+49 201 177 1234'],
            
            // Ashland (fournisseur_9)
            ['fournisseur_ref' => 'fournisseur_9', 'nom' => 'Johnson', 'prenom' => 'Robert', 'fonction' => 'Account Executive', 'email' => 'r.johnson@ashland.com', 'tel' => '+1 302 995 3123'],
        ];

        foreach ($contacts as $index => $data) {
            $contact = new ContactFournisseur();
            $contact->setNom($data['nom']);
            $contact->setPrenom($data['prenom'] ?? null);
            $contact->setFonction($data['fonction'] ?? null);
            $contact->setEmail($data['email'] ?? null);
            $contact->setTelContact($data['tel'] ?? null);
            
            $fournisseur = $this->getReference($data['fournisseur_ref'], Fournisseur::class);
            $contact->setFournisseur($fournisseur);
            
            $manager->persist($contact);
            
            $this->addReference('contact_' . $index, $contact);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            FournisseurFixtures::class,
        ];
    }
}
