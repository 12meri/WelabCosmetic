<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\AlerteRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\DBAL\Types\Types;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: AlerteRepository::class)]
#[ApiResource(
     operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Patch(),
        new Delete(),
    ]
)]
class Alerte
{
    // const TYPE_STOCK_BAS = 'STOCK_BAS';
    // const TYPE_DDM_PROCHE = 'DDM_PROCHE';
    // const TYPE_PERIME = 'PERIME';

    // const ETAT_ACTIVE = 'ACTIVE';
    // const ETAT_TRAITEE = 'TRAITEE';
    // const ETAT_IGNOREE = 'IGNOREE';
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
    #[ORM\Column(length: 40)]
    private ?string $typeAlerte = null;

    #[ORM\Column(length: 30, options: ['default' => 'ACTIVE'])]
    private ?string $etatAlerte = 'ACTIVE';

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $dateAlerte = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $message = null;

    #[ORM\ManyToOne(inversedBy: 'alertes')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Lot $lot = null;

   #[ORM\OneToMany(targetEntity: DemandeEchantillon::class, mappedBy: 'alerte')]
    private Collection $demandes; 

    public function __construct()
    {
        $this->dateAlerte = new \DateTime();
        $this->demandes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTypeAlerte(): ?string
    {
        return $this->typeAlerte;
    }

    public function setTypeAlerte(string $typeAlerte): static
    {
        $this->typeAlerte = $typeAlerte;
        return $this;
    }

    public function getEtatAlerte(): ?string
    {
        return $this->etatAlerte;
    }

    public function setEtatAlerte(string $etatAlerte): static
    {
        $this->etatAlerte = $etatAlerte;
        return $this;
    }

    public function getDateAlerte(): ?\DateTimeInterface
    {
        return $this->dateAlerte;
    }

    public function setDateAlerte(\DateTimeInterface $dateAlerte): static
    {
        $this->dateAlerte = $dateAlerte;
        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(?string $message): static
    {
        $this->message = $message;
        return $this;
    }

    public function getLot(): ?Lot
    {
        return $this->lot;
    }

    public function setLot(?Lot $lot): static
    {
        $this->lot = $lot;
        return $this;
    }

   
    /**
 * @return Collection<int, DemandeEchantillon>
 */
public function getDemandes(): Collection
{
    return $this->demandes;
}

public function addDemande(DemandeEchantillon $demande): static
{
    if (!$this->demandes->contains($demande)) {
        $this->demandes->add($demande);
        $demande->setAlerte($this);
    }
    return $this;
}

public function removeDemande(DemandeEchantillon $demande): static
{
    if ($this->demandes->removeElement($demande)) {
        if ($demande->getAlerte() === $this) {
            $demande->setAlerte(null);
        }
    }
    return $this;
}
}
