<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\LotRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: LotRepository::class)]
#[ORM\UniqueConstraint(name:'unique_num_lot',columns:['num_lot'])] # numero de lot unique
#[ApiResource(
     operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Patch(),
        new Delete(),
    ]
)]
class Lot
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 60, unique:true)]
    private ?string $numLot = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTime $dateArrivee = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTime $ddm = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 12, scale: 2)]
    private ?string $qtInitiale = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 12, scale: 2, nullable: true)]
    private ?string $qtRestante = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTime $dateMaj = null; // \DateTimeInterface

    

    #[ORM\Column(type: Types::DECIMAL, precision: 12, scale: 2, nullable: true)]
    private ?string $qtMin = null;

    #[ORM\Column(length: 50 , options:['default' => 'OK'])]
    private ?string $etat = 'OK';

    #[ORM\ManyToOne(inversedBy:'lots')]
    #[ORM\JoinColumn(nullable:false)]
    private ?MatPremiere $mp = null;

    #[ORM\ManyToOne(inversedBy: 'lots')]
    private ?DemandeEchantillon $demandeEchantillon = null;

    #[ORM\OneToMany(targetEntity: Alerte::class, mappedBy: 'lot')]
    private Collection $alertes;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNumLot(): ?string
    {
        return $this->numLot;
    }

    public function setNumLot(string $numLot): static
    {
        $this->numLot = $numLot;

        return $this;
    }

    public function getDateArrivee(): ?\DateTime
    {
        return $this->dateArrivee;
    }

    public function setDateArrivee(?\DateTime $dateArrivee): static
    {
        $this->dateArrivee = $dateArrivee;

        return $this;
    }

    public function getDdm(): ?\DateTime
    {
        return $this->ddm;
    }

    public function setDdm(?\DateTime $ddm): static
    {
        $this->ddm = $ddm;

        return $this;
    }

    public function getQtInitiale(): ?string
    {
        return $this->qtInitiale;
    }

    public function setQtInitiale(string $qtInitiale): static
    {
        $this->qtInitiale = $qtInitiale;

        return $this;
    }

    public function getQtRestante(): ?string
    {
        return $this->qtRestante;
    }

    public function setQtRestante(?string $qtRestante): static
    {
        $this->qtRestante = $qtRestante;

        return $this;
    }

    public function getDateMaj(): ?\DateTime
    {
        return $this->dateMaj;
    }

    public function setDateMaj(?\DateTime $dateMaj): static
    {
        $this->dateMaj = $dateMaj;

        return $this;
    }

    

    public function getQtMin(): ?string
    {
        return $this->qtMin;
    }

    public function setQtMin(?string $qtMin): static
    {
        $this->qtMin = $qtMin;

        return $this;
    }

    public function getEtat(): ?string
    {
        return $this->etat;
    }

    public function setEtat(string $etat): static
    {
        $this->etat = $etat;

        return $this;
    }

    public function getMp(): ?MatPremiere
    {
        return $this->mp;
    }
    public function setMp(?MatPremiere $mp): static {
        $this->mp = $mp;
        return $this;
    }

    
    public function getDemandeEchantillon(): ?DemandeEchantillon
    {
        return $this->demandeEchantillon;
    }

    public function setDemandeEchantillon(?DemandeEchantillon $demandeEchantillon): static
    {
        $this->demandeEchantillon = $demandeEchantillon;
        return $this;
    }

    // alerte
        public function __construct()
    {
        $this->alertes = new ArrayCollection();
    }

    public function getAlertes(): Collection
    {
        return $this->alertes;
    }

    public function addAlerte(Alerte $alerte): static
    {
        if (!$this->alertes->contains($alerte)) {
            $this->alertes->add($alerte);
            $alerte->setLot($this);
        }
        return $this;
    }

    public function removeAlerte(Alerte $alerte): static
    {
        if ($this->alertes->removeElement($alerte)) {
            if ($alerte->getLot() === $this) {
                $alerte->setLot(null);
            }
        }
        return $this;
    }
        
}
