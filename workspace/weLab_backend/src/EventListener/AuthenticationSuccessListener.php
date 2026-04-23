<?php

namespace App\EventListener;


use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use App\Entity\User;

// #[AsEventListener(event: AuthenticationSuccessEvent::class)]

final class AuthenticationSuccessListener
{
    #[AsEventListener]
    public function onAuthenticationSuccessEvent(AuthenticationSuccessEvent $event): void
    {
        // Récupérer l'utilisateur authentifié
        $user = $event->getUser();
        // Vérifier que l'utilisateur est une instance de User
        if (!$user instanceof User) {
            return;
    }
    $data = $event->getData();  // contient déjà ['token' => '...']
        // Ajoute les infos utiles pour le frontend Angular
        $data['email'] = $user->getEmail();
        $data['nom'] = $user->getNom();
        $data['prenom'] = $user->getPrenom();
        $data['roles'] = $user->getRoles();

        $event->setData($data); // Met à jour les données de la réponse

}}
