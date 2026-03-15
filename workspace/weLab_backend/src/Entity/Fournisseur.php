<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\FournisseurRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FournisseurRepository::class)]
#[ApiResource()]
class Fournisseur
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 200)]
    private ?string $nomEntr = null;

    #[ORM\Column(length: 200, nullable: true)]
    private ?string $adresse = null;

    #[ORM\Column(length: 200, nullable: true)]
    private ?string $emailGen = null;

    #[ORM\Column(length: 30, nullable: true)]
    private ?string $telFourni = null;

    /**
     * @var Collection<int, Distribution>
     */
    #[ORM\OneToMany(targetEntity: Distribution::class, mappedBy: 'fournisseur')]
    private Collection $distributions;

    /**
     * @var Collection<int, ContactFournisseur>
     */
    #[ORM\OneToMany(targetEntity: ContactFournisseur::class, mappedBy: 'fournisseur')]
    private Collection $contactFournisseurs;

    /**
     * @var Collection<int, Fournir>
     */
    #[ORM\OneToMany(targetEntity: Fournir::class, mappedBy: 'fournisseur')]
    private Collection $fournirs;

    public function __construct()
    {
        $this->distributions = new ArrayCollection();
        $this->contactFournisseurs = new ArrayCollection();
        $this->fournirs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomEntr(): ?string
    {
        return $this->nomEntr;
    }

    public function setNomEntr(string $nom_entr): static
    {
        $this->nomEntr = $nom_entr;

        return $this;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(?string $adresse): static
    {
        $this->adresse = $adresse;

        return $this;
    }

    public function getEmailGen(): ?string
    {
        return $this->emailGen;
    }

    public function setEmailGen(?string $email_gen): static
    {
        $this->emailGen = $email_gen;

        return $this;
    }

    public function getTelFourni(): ?string
    {
        return $this->telFourni;
    }

    public function setTelFourni(?string $tel_fourni): static
    {
        $this->telFourni = $tel_fourni;

        return $this;
    }

    /**
     * @return Collection<int, Distribution>
     */
    public function getDistributions(): Collection
    {
        return $this->distributions;
    }

    public function addDistribution(Distribution $distribution): static
    {
        if (!$this->distributions->contains($distribution)) {
            $this->distributions->add($distribution);
            $distribution->setFournisseur($this);
        }

        return $this;
    }

    public function removeDistribution(Distribution $distribution): static
    {
        if ($this->distributions->removeElement($distribution)) {
            // set the owning side to null (unless already changed)
            if ($distribution->getFournisseur() === $this) {
                $distribution->setFournisseur(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ContactFournisseur>
     */
    public function getContactFournisseurs(): Collection
    {
        return $this->contactFournisseurs;
    }

    public function addContactFournisseur(ContactFournisseur $contactFournisseur): static
    {
        if (!$this->contactFournisseurs->contains($contactFournisseur)) {
            $this->contactFournisseurs->add($contactFournisseur);
            $contactFournisseur->setFournisseur($this);
        }

        return $this;
    }

    public function removeContactFournisseur(ContactFournisseur $contactFournisseur): static
    {
        if ($this->contactFournisseurs->removeElement($contactFournisseur)) {
            // set the owning side to null (unless already changed)
            if ($contactFournisseur->getFournisseur() === $this) {
                $contactFournisseur->setFournisseur(null);
            }
        }

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
            $fournir->setFournisseur($this);
        }

        return $this;
    }

    public function removeFournir(Fournir $fournir): static
    {
        if ($this->fournirs->removeElement($fournir)) {
            // set the owning side to null (unless already changed)
            if ($fournir->getFournisseur() === $this) {
                $fournir->setFournisseur(null);
            }
        }

        return $this;
    }
}
