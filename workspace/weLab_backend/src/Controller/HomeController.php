<?php
// src/Controller/HomeController.php  (PAS dans Api/, juste dans Controller/)

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{
    #[Route('/api/home', name: 'api_home')] ## pour angular
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Bienvenue',
            'date' => date('Y-m-d'),
        ]);
    }
    #[Route('/home', name: 'admin_products')] ## dans twig
    public function index1(): Response
    {
        return $this->render('home/index.html.twig');
    }
}