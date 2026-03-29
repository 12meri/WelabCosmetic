<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\MatPremiereRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MatPremiereRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
    ]
)]
class MatPremiere
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['matiere_premiere:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 200)]
    #[Groups(['matiere_premiere:read'])]
    private ?string $nomMP = null;

    #[ORM\Column(length: 200, nullable: true)]
    #[Groups(['matiere_premiere:read'])]
    private ?string $INCI = null;

    #[ORM\Column(length: 60, nullable: true)]
    #[Groups(['matiere_premiere:read'])]
    private ?string $NOI = null;

    #[ORM\Column(length: 80, nullable: true)]
    #[Groups(['matiere_premiere:read'])]
    private ?string $categorie = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['matiere_premiere:read'])]
    private ?string $fonction = null;

    #[ORM\Column(length: 10, nullable: true)]
    #[Groups(['matiere_premiere:read'])]
    private ?string $cosmos = null;

    /**
     * @var Collection<int, Fournir>
     */
    #[ORM\OneToMany(targetEntity: Fournir::class, mappedBy: 'matPrem')]
    private Collection $fournirs;

    /**
     * @var Collection<int, Distribue>
     */
    #[ORM\OneToMany(targetEntity: Distribue::class, mappedBy: 'mp')]
    private Collection $distribues;

    /**
     * @var Collection<int, Lot>
     */
    #[ORM\OneToMany(targetEntity: Lot::class, mappedBy: 'mp')]
    private Collection $lots;

    /**
     * @var Collection<int, DemandeEchantillon>
     */
    #[ORM\OneToMany(targetEntity: DemandeEchantillon::class, mappedBy: 'mp')]
    private Collection $demandeEchantillons;

    public function __construct()
    {
        $this->lots = new ArrayCollection();
        $this->fournirs = new ArrayCollection();
        $this->distribues = new ArrayCollection();
        $this->demandeEchantillons = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomMP(): ?string
    {
        return $this->nomMP;
    }

    public function setNomMP(string $nomMP): static
    {
        $this->nomMP = $nomMP;
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
            $fournir->setMatPrem($this);
        }
        return $this;
    }

    public function removeFournir(Fournir $fournir): static
    {
        if ($this->fournirs->removeElement($fournir)) {
            if ($fournir->getMatPrem() === $this) {
                $fournir->setMatPrem(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, Distribue>
     */
    public function getDistribues(): Collection
    {
        return $this->distribues;
    }

    public function addDistribue(Distribue $distribue): static
    {
        if (!$this->distribues->contains($distribue)) {
            $this->distribues->add($distribue);
            $distribue->setMp($this);
        }
        return $this;
    }

    public function removeDistribue(Distribue $distribue): static
    {
        if ($this->distribues->removeElement($distribue)) {
            if ($distribue->getMp() === $this) {
                $distribue->setMp(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, Lot>
     */
    public function getLots(): Collection
    {
        return $this->lots;
    }

    public function addLot(Lot $lot): static
    {
        if (!$this->lots->contains($lot)) {
            $this->lots->add($lot);
            $lot->setMp($this);
        }
        return $this;
    }

    public function removeLot(Lot $lot): static
    {
        if ($this->lots->removeElement($lot)) {
            if ($lot->getMp() === $this) {
                $lot->setMp(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, DemandeEchantillon>
     */
    public function getDemandeEchantillons(): Collection
    {
        return $this->demandeEchantillons;
    }

    public function addDemandeEchantillon(DemandeEchantillon $demandeEchantillon): static
    {
        if (!$this->demandeEchantillons->contains($demandeEchantillon)) {
            $this->demandeEchantillons->add($demandeEchantillon);
            $demandeEchantillon->setMp($this);
        }
        return $this;
    }

    public function removeDemandeEchantillon(DemandeEchantillon $demandeEchantillon): static
    {
        if ($this->demandeEchantillons->removeElement($demandeEchantillon)) {
            if ($demandeEchantillon->getMp() === $this) {
                $demandeEchantillon->setMp(null);
            }
        }
        return $this;
    }
}
