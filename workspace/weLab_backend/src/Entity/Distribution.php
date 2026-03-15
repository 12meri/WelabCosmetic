<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\DistributionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DistributionRepository::class)]
#[ApiResource()]
class Distribution
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 200)]
    private ?string $nomMarque = null;

    #[ORM\ManyToOne(inversedBy: 'distributions')]
    #[ORM\JoinColumn(nullable: false , onDelete: 'CASCADE')]
    private ?Fournisseur $fournisseur = null;

    /**
     * @var Collection<int, Fournir>
     */
    #[ORM\OneToMany(targetEntity: Fournir::class, mappedBy: 'distribution')]
    private Collection $fournirs;

    public function __construct()
    {
        $this->fournirs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomMarque(): ?string
    {
        return $this->nomMarque;
    }

    public function setNomMarque(string $nomMarque): static
    {
        $this->nomMarque = $nomMarque;

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

    /**
     * @return Collection<int, Fournir>
     */
    public function getFournirs(): Collection
    {
        return $this->fournirs;
    }

    public function addFournir(Fournir $fournir): static
    {
        if (!$this->fournirs->contains($fournir)) {
            $this->fournirs->add($fournir);
            $fournir->setDistribution($this);
        }

        return $this;
    }

    public function removeFournir(Fournir $fournir): static
    {
        if ($this->fournirs->removeElement($fournir)) {
            // set the owning side to null (unless already changed)
            if ($fournir->getDistribution() === $this) {
                $fournir->setDistribution(null);
            }
        }

        return $this;
    }
}
