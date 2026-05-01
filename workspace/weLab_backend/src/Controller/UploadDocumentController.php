<?php

namespace App\Controller;

use App\Entity\Document;
use App\Entity\Fournisseur;
use App\Entity\Lot;
use App\Entity\MatPremiere;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Serializer\SerializerInterface;

#[AsController]
class UploadDocumentController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
    ) {
    }

    // Ce controller est invoqué par API Platform pour l'opération POST /api/documents.
    // Raison : API Platform 4.x ne sait pas désérialiser nativement le format multipart/form-data
    // (erreur "Deserialization for the format 'multipart' is not supported").
    // On passe donc deserialize: false sur l'opération Post de l'entité Document, ce qui dit
    // à API Platform : "ne tente pas de construire l'objet à partir du body, c'est moi qui m'en charge".
    // Ce __invoke construit l'entité Document à la main, puis la retourne. API Platform reprend
    // ensuite la main pour valider, persister (le PostProcessor par défaut), et sérialiser la réponse 201.
    public function __invoke(Request $request): JsonResponse
    {
        // Le fichier binaire arrive dans $request->files (bag dédié aux UploadedFile),
        // pas dans $request->request qui ne contient que les champs texte du formulaire.
        $uploadedFile = $request->files->get('file');

        if (!$uploadedFile) {
            throw new BadRequestHttpException('"file" is required');
        }

        $document = new Document();

        // setFile() déclenche le mécanisme Vich : à la prochaine persistance, le bundle
        // déplace physiquement le fichier dans public/uploads/documents/ avec un nom unique
        // généré par SmartUniqueNamer, et remplit automatiquement le champ fileName.
        $document->setFile($uploadedFile);

        // Métadonnées texte envoyées en plus du fichier dans le même formulaire multipart.
        $nomFile = $request->request->get('nomFile');
        $type = $request->request->get('type');

        if ($nomFile !== null) {
            $document->setNomFile($nomFile);
        }
        if ($type !== null) {
            $document->setType($type);
        }

        // Relations ManyToMany : le frontend envoie des IRI (ex: "/api/lots/3") via FormData.
        // $request->request->all('lots') récupère le tableau complet quand le champ est répété
        // sous la forme lots[]=/api/lots/1&lots[]=/api/lots/2.
        $this->attachRelations(
            $request->request->all('lots'),
            Lot::class,
            fn(Lot $lot) => $document->addLot($lot)
        );
        $this->attachRelations(
            $request->request->all('matieres'),
            MatPremiere::class,
            fn(MatPremiere $matiere) => $document->addMatiere($matiere)
        );
        $this->attachRelations(
            $request->request->all('fournisseurs'),
            Fournisseur::class,
            fn(Fournisseur $fournisseur) => $document->addFournisseur($fournisseur)
        );

        // Avec deserialize: false, API Platform ne déclenche plus son processor par défaut :
        // c'est donc à nous de persister l'entité. Le flush() déclenche aussi l'upload Vich
        // (qui écoute prePersist) et remplit le champ fileName avec le nom unique généré.
        $this->entityManager->persist($document);
        $this->entityManager->flush();

        // De même, le SerializeListener d'API Platform ne reprend pas la main dans ce mode :
        // on construit donc nous-mêmes la réponse JSON, en utilisant le groupe document:read
        // pour exposer exactement les mêmes champs qu'un GET sur cette ressource.
        $payload = $this->serializer->serialize(
            $document,
            'json',
            ['groups' => ['document:read']]
        );

        return new JsonResponse($payload, JsonResponse::HTTP_CREATED, [], true);
    }

    /**
     * Pour chaque IRI reçue, on extrait l'id (dernier segment de l'URL) et on charge
     * l'entité associée via son repository, puis on l'attache au Document via le callback.
     *
     * @param string[] $iris
     * @param class-string $entityClass
     */
    private function attachRelations(array $iris, string $entityClass, callable $attach): void
    {
        $repository = $this->entityManager->getRepository($entityClass);

        foreach ($iris as $iri) {
            if (!is_string($iri) || $iri === '') {
                continue;
            }

            // On extrait l'id du dernier segment de l'IRI : "/api/lots/3" -> "3".
            // explode est volontairement préféré à un preg_match pour rester lisible.
            $parts = explode('/', trim($iri, '/'));
            $id = end($parts);

            if (!ctype_digit((string) $id)) {
                continue;
            }

            $entity = $repository->find((int) $id);
            if ($entity !== null) {
                $attach($entity);
            }
        }
    }
}
