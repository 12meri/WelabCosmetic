<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Repository\MatPremiereRepository;
use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\Routing\Attribute\Route;

class MatPreController extends AbstractController
{

    private MatPremiereRepository $matPremiereRepository;
    public function __construct(MatPremiereRepository $matPremiereRepository)
    {
        $this->matPremiereRepository = $matPremiereRepository;
    }

   #[Route('/api/mp', name: 'api_mp', methods: ['GET'])]
public function getMatieres(): JsonResponse
{
    // Utilise la version SANS relations
    $matieres = $this->matPremiereRepository->findAllWithoutRelations();
    
    return $this->json($matieres);
}}