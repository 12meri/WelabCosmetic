<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Patch(),
        new Delete(),
    ],
    normalizationContext: ['groups' => ['email:read']],
    denormalizationContext: ['groups' => ['email:write']]
)]
class Email
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['email:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['email:read', 'email:write'])]
    private ?string $txt = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['email:read', 'email:write'])]
    private ?\DateTimeInterface $dateEnvoie = null;

    #[ORM\Column(length: 200, nullable: true)]
    #[Groups(['email:read', 'email:write'])]
    private ?string $sujet = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['email:read', 'email:write'])]
    private ?DemandeEchantillon $demandeEchantillon = null;

    public function __construct()
    {
        $this->dateEnvoie = new \DateTime();
    }

    public function getId(): ?int { return $this->id; }
    public function getTxt(): ?string { return $this->txt; }
    public function setTxt(?string $txt): static { $this->txt = $txt; return $this; }
    public function getDateEnvoie(): ?\DateTimeInterface { return $this->dateEnvoie; }
    public function setDateEnvoie(?\DateTimeInterface $dateEnvoie): static { $this->dateEnvoie = $dateEnvoie; return $this; }
    public function getSujet(): ?string { return $this->sujet; }
    public function setSujet(?string $sujet): static { $this->sujet = $sujet; return $this; }
    public function getDemandeEchantillon(): ?DemandeEchantillon { return $this->demandeEchantillon; }
    public function setDemandeEchantillon(?DemandeEchantillon $demandeEchantillon): static { $this->demandeEchantillon = $demandeEchantillon; return $this; }
}