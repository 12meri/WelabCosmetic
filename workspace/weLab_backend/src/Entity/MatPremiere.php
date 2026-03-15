<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\MatPremiereRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MatPremiereRepository::class)]
#[ApiResource()]
class MatPremiere
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 200)]
    private ?string $nomMP = null;

    #[ORM\Column(length: 200, nullable: true)]
    private ?string $INCI = null;

    #[ORM\Column(length: 60, nullable: true)]
    private ?string $NOI = null;

    #[ORM\Column(length: 80, nullable: true)]
    private ?string $categorie = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $fonction = null;

    #[ORM\Column(length: 10, nullable: true)]
    private ?string $cosmos = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomMP(): ?string
    {
        return $this->nomMP;
    }

    public function setNomMP(string $nom_MP): static
    {
        $this->nomMP = $nom_MP;

        return $this;
    }

    public function getINCI(): ?string
    {
        return $this->INCI;
    }

    public function setINCI(?string $INCI): static
    {
        $this->INCI = $INCI;

        return $this;
    }

    public function getNOI(): ?string
    {
        return $this->NOI;
    }

    public function setNOI(?string $NOI): static
    {
        $this->NOI = $NOI;

        return $this;
    }

    public function getCategorie(): ?string
    {
        return $this->categorie;
    }

    public function setCategorie(?string $categorie): static
    {
        $this->categorie = $categorie;

        return $this;
    }

    public function getFonction(): ?string
    {
        return $this->fonction;
    }

    public function setFonction(?string $fonction): static
    {
        $this->fonction = $fonction;

        return $this;
    }

    public function getCosmos(): ?string
    {
        return $this->cosmos;
    }

    public function setCosmos(?string $cosmos): static
    {
        $this->cosmos = $cosmos;

        return $this;
    }
}
