<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Stagiaire extends User
{
    #[ORM\Column(type: 'date', nullable: true)]
    private ?\DateTime $debutStage = null;

    #[ORM\Column(type: 'date', nullable: true)]
    private ?\DateTime $finStage = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $fonction = null;

    // Getters et setters
    public function getDebutStage(): ?\DateTime
    {
        return $this->debutStage;
    }

    public function setDebutStage(?\DateTime $debutStage): static
    {
        $this->debutStage = $debutStage;
        return $this;
    }

    public function getFinStage(): ?\DateTime
    {
        return $this->finStage;
    }

    public function setFinStage(?\DateTime $finStage): static
    {
        $this->finStage = $finStage;
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
}