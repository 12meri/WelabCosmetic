<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\FournirRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FournirRepository::class)]
#[ORM\UniqueConstraint(name: 'unique_prix_mp_four_dist', 
columns:['mat_prem_id','fournisseur_id','distribution_id'])]
# pour avoir une instance de prix par marque 
#[ApiResource(
        operations: [
            new GetCollection(),
            new Get(),
            new Post(),
            new Patch(),
            new Delete(),
        ]
)]
class Fournir
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'fournirs')]
    #[ORM\JoinColumn(nullable: false , onDelete: 'CASCADE')]
    private ?MatPremiere $matPrem = null;

    #[ORM\ManyToOne(inversedBy: 'fournirs')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Fournisseur $fournisseur = null;

    /**
     * Marque (distribution) pour laquelle cette fourniture est valable.
     * 
     * - NULL : la matière est fournie sans restriction de marque.
     * - Renseignée : la matière est fournie spécifiquement pour cette marque.
     * 
     * Si une distribution est supprimée, les fournitures associées sont supprimées en cascade (onDelete: CASCADE).
     * 
     * Un même fournisseur peut vendre la même matière pour différentes marques (ex: huile d'argan pour marque A et marque B),
     * avec des prix éventuellement différents. La contrainte d'unicité sur (mat_prem, fournisseur, distribution)
     * empêche d'avoir deux fois la même fourniture pour un triplet identique.
     */
    #[ORM\ManyToOne(inversedBy: 'fournirs')]
    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    private ?Distribution $distribution = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $prix = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $moq = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMatPrem(): ?MatPremiere
    {
        return $this->matPrem;
    }

    public function setMatPrem(?MatPremiere $MatPrem): static
    {
        $this->matPrem = $MatPrem;

        return $this;
    }

    public function getFournisseur(): ?Fournisseur
    {
        return $this->fournisseur;
    }

    public function setFournisseur(?Fournisseur $fournisseur): static
    {
        $this->fournisseur = $fournisseur;

        return $this;
    }

    public function getDistribution(): ?Distribution
    {
        return $this->distribution;
    }

    public function setDistribution(?Distribution $distribution): static
    {
        $this->distribution = $distribution;

        return $this;
    }

    public function getPrix(): ?string
    {
        return $this->prix;
    }

    public function setPrix(?string $prix): static
    {
        $this->prix = $prix;

        return $this;
    }

    public function getMoq(): ?string
    {
        return $this->moq;
    }

    public function setMoq(?string $moq): static
    {
        $this->moq = $moq;

        return $this;
    }
}
