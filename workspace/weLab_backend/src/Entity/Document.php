<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[ORM\Entity]
#[Vich\Uploadable]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(
            inputFormats: ['multipart' => ['multipart/form-data']]
        ),
        new Patch(),
        new Delete(),
    ],
    normalizationContext: ['groups' => ['document:read']],
    denormalizationContext: ['groups' => ['document:write']]
)]
class Document
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['document:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 200)]
    #[Groups(['document:read', 'document:write'])]
    private ?string $nomFile = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['document:read', 'document:write'])]
    private ?string $type = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['document:read'])]
    private ?\DateTimeInterface $dateUpload = null;

    // --- VichUploader ---
    #[Vich\UploadableField(mapping: 'documents', fileNameProperty: 'fileName')]
    private ?File $file = null;

    #[ORM\Column(nullable: true)]
    private ?string $fileName = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    // Relations ManyToMany
    #[ORM\ManyToMany(targetEntity: Lot::class, inversedBy: 'documents')]
    #[ORM\JoinTable(name: 'doc_lot')]
    #[Groups(['document:read', 'document:write'])]
    private Collection $lots;

    #[ORM\ManyToMany(targetEntity: MatPremiere::class, inversedBy: 'documents')]
    #[ORM\JoinTable(name: 'doc_mp')]
    #[Groups(['document:read', 'document:write'])]
    private Collection $matieres;

    #[ORM\ManyToMany(targetEntity: Fournisseur::class, inversedBy: 'documents')]
    #[ORM\JoinTable(name: 'doc_four')]
    #[Groups(['document:read', 'document:write'])]
    private Collection $fournisseurs;

    // --------------------------------------------------------------

    public function __construct()
    {
        $this->lots = new ArrayCollection();
        $this->matieres = new ArrayCollection();
        $this->fournisseurs = new ArrayCollection();
        $this->dateUpload = new \DateTime();
    }

    public function getId(): ?int { return $this->id; }

    public function getNomFile(): ?string { return $this->nomFile; }
    public function setNomFile(string $nomFile): static { $this->nomFile = $nomFile; return $this; }

    public function getType(): ?string { return $this->type; }
    public function setType(?string $type): static { $this->type = $type; return $this; }

    public function getDateUpload(): ?\DateTimeInterface { return $this->dateUpload; }
    public function setDateUpload(?\DateTimeInterface $dateUpload): static { $this->dateUpload = $dateUpload; return $this; }

    // --- Vich getters/setters ---
    public function setFile(?File $file): void
    {
        $this->file = $file;
        if ($file) {
            $this->updatedAt = new \DateTimeImmutable();
        }
    }

    public function getFile(): ?File { return $this->file; }

    public function getFileName(): ?string { return $this->fileName; }
    public function setFileName(?string $fileName): void { $this->fileName = $fileName; }

    public function getUpdatedAt(): ?\DateTimeInterface { return $this->updatedAt; }
    public function setUpdatedAt(?\DateTimeInterface $updatedAt): void { $this->updatedAt = $updatedAt; }

    // --- Relations ---
    public function getLots(): Collection { return $this->lots; }
    public function addLot(Lot $lot): static {
        if (!$this->lots->contains($lot)) $this->lots->add($lot);
        return $this;
    }
    public function removeLot(Lot $lot): static {
        $this->lots->removeElement($lot);
        return $this;
    }

    public function getMatieres(): Collection { return $this->matieres; }
    public function addMatiere(MatPremiere $matiere): static {
        if (!$this->matieres->contains($matiere)) $this->matieres->add($matiere);
        return $this;
    }
    public function removeMatiere(MatPremiere $matiere): static {
        $this->matieres->removeElement($matiere);
        return $this;
    }

    public function getFournisseurs(): Collection { return $this->fournisseurs; }
    public function addFournisseur(Fournisseur $fournisseur): static {
        if (!$this->fournisseurs->contains($fournisseur)) $this->fournisseurs->add($fournisseur);
        return $this;
    }
    public function removeFournisseur(Fournisseur $fournisseur): static {
        $this->fournisseurs->removeElement($fournisseur);
        return $this;
    }
}