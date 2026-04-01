<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\DistribueRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DistribueRepository::class)]
#[ORM\UniqueConstraint(name: 'unique_dist_mp', columns:['distribution_id','mp_id'])]
#[ApiResource(
    operations: [
            new GetCollection(),
            new Get(),
            new Post(),
            new Patch(),
            new Delete(),
        ]
)]
class Distribue
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'distribues')]
    #[ORM\JoinColumn(nullable: false , onDelete: 'CASCADE')]
    private ?Distribution $distribution = null;

    #[ORM\ManyToOne(inversedBy: 'distribues')]
    #[ORM\JoinColumn(nullable: false , onDelete: 'CASCADE')]
    private ?MatPremiere $mp = null;

    #[ORM\ManyToOne(inversedBy: 'distribues')]
    #[ORM\JoinColumn(onDelete: 'SET NULL')]
    private ?ContactFournisseur $contact = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDistribution(): ?Distribution
    {
        return $this->distribution;
    }

    public function setDistribution(?Distribution $distribution): static
    {
        $this->distribution = $distribution;

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

    public function getContact(): ?ContactFournisseur
    {
        return $this->contact;
    }

    public function setContact(?ContactFournisseur $contact): static
    {
        $this->contact = $contact;

        return $this;
    }
}
