<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\DemandeEchantillonRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: DemandeEchantillonRepository::class)]
#[ApiResource(
     operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Patch(),
        new Delete(),
    ]
)]
class DemandeEchantillon
{

//  définir des constantes :
        // const ETAT_EN_COURS = 'EN_COURS';
        // const ETAT_ENVOYE = 'ENVOYE';
        // const ETAT_RECU = 'RECU';
        // const ETAT_REFUSE = 'REFUSE';
        // const ETAT_ANNULE = 'ANNULE';
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTime $dateDemande = null;

    #[ORM\Column(length: 30 , options:['default' => 'EN_COURS'])]
    private ?string $etat = 'EN_COURS';

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTime $delaiLivraison = null;

    #[ORM\ManyToOne(inversedBy: 'demandeEchantillons')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Fournisseur $fournisseur = null;

    #[ORM\ManyToOne(inversedBy: 'demandeEchantillons')]
    #[ORM\JoinColumn(nullable: false)]
    private ?MatPremiere $mp = null;

    #[ORM\ManyToOne(inversedBy: 'demandes')]
    private ?Alerte $alerte = null;

    
    // #[ORM\ManyToOne(inversedBy: 'demandes')]
    // #[ORM\JoinColumn(nullable: false)]
    // private ?Utilisateur $utilisateur = null;

    #[ORM\OneToMany(targetEntity: Lot::class, mappedBy: 'demandeEchantillon')]
    private Collection $lots;


    public function __construct()
    {
        $this->dateDemande = new \DateTime();
        //$this->lots = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateDemande(): ?\DateTime
    {
        return $this->dateDemande;
    }

    public function setDateDemande(\DateTime $dateDemande): static
    {
        $this->dateDemande = $dateDemande;

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

    public function getDelaiLivraison(): ?\DateTime
    {
        return $this->delaiLivraison;
    }

    public function setDelaiLivraison(?\DateTime $delaiLivraison): static
    {
        $this->delaiLivraison = $delaiLivraison;

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

    public function getMp(): ?MatPremiere
    {
        return $this->mp;
    }

    public function setMp(?MatPremiere $mp): static
    {
        $this->mp = $mp;

        return $this;
    }
  public function getAlerte(): ?Alerte
    {
        return $this->alerte;
    }

    public function setAlerte(?Alerte $alerte): static
    {
        if ($this->alerte !== null) {
            $this->alerte->removeDemande($this);
        }
        
        if ($alerte !== null) {
            $alerte->addDemande($this);
        }
        
        $this->alerte = $alerte;
        return $this;
    }
    // public function getUtilisateur(): ?Utilisateur
    // {
    //     return $this->utilisateur;
    // }

    // public function setUtilisateur(?Utilisateur $utilisateur): static
    // {
    //     $this->utilisateur = $utilisateur;

    //     return $this;
    // }


    // relation lot demande , les lots creer par la demande 
    /**
     * @return Collection<int, Lot>
     */
    public function getLots(): Collection { return $this->lots; }

    public function addLot(Lot $lot): static
    {
        if (!$this->lots->contains($lot)) {
            $this->lots->add($lot);
            $lot->setDemandeEchantillon($this);
        }
        return $this;
    }

    public function removeLot(Lot $lot): static
    {
        if ($this->lots->removeElement($lot)) {
            if ($lot->getDemandeEchantillon() === $this) {
                $lot->setDemandeEchantillon(null);
            }
        }
        return $this;
    }
}
