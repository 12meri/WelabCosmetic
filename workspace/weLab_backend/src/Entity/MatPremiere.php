<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\MatPremiereRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: MatPremiereRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            paginationEnabled: false // on désactive la pagination pour les collections de matières premières afin de retourner toutes les matières premières en une seule requête, ce qui est acceptable si le nombre de matières premières n'est pas trop élevé, sinon il faudrait envisager d'ajouter des filtres ou de réactiver la pagination pour éviter de surcharger le serveur et le client avec trop de données
        ),
        new Get(),
        new Post(),
        new Patch(),
        new Delete(
            // security: "is_granted('ROLE_ADMIN')" // on pourrait ajouter une règle de sécurité pour restreindre la suppression des matières premières aux utilisateurs ayant le rôle admin, mais pour l'instant on laisse tout le monde pouvoir supprimer les matières premières pour faciliter les tests et le développement, on pourra ajouter cette règle plus tard si besoin
        ),
    ]
    // normalizationContext: ['groups' => ['matiere_premiere:read']], // on définit un groupe de sérialisation pour les opérations de lecture (Get et GetCollection) afin d'inclure les propriétés annotées avec ce groupe dans les réponses de l'API
//    denormalizationContext: ['groups' => ['matiere_premiere:write']] // on pourrait aussi définir un groupe de sérialisation pour les opérations d'écriture (Post, Patch, Delete) afin d'inclure les propriétés annotées avec ce groupe dans les requêtes de l'API
)]
class MatPremiere
{
    #[ORM\Id] // clé primaire
    #[ORM\GeneratedValue] // doctrine va générer automatiquement une valeur unique pour l'id
    #[ORM\Column] // c'est une colonne dans la table de la base de données
    #[Groups(['matiere_premiere:read'])] // on ajoute le groupe de sérialisation pour pouvoir inclure l'id dans les réponses de l'API 
    private ?int $id = null; // id peut être null pour les objets qui n'ont pas encore été persistés en base de données, mais une fois persistés, ils auront un id non null

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

    

    // ...
#[ORM\ManyToMany(targetEntity: Document::class, mappedBy: 'matieres')]
private Collection $documents;



public function getDocuments(): Collection { return $this->documents; }

public function addDocument(Document $document): static
{
    if (!$this->documents->contains($document)) {
        $this->documents->add($document);
        $document->addMatiere($this);
    }
    return $this;
}

public function removeDocument(Document $document): static {
    if ($this->documents->removeElement($document)) {
        $document->removeMatiere($this);
    }
    return $this;
 }

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

    // constructeur
    public function __construct()
    {
        $this->lots = new ArrayCollection();
        $this->fournirs = new ArrayCollection();
        $this->distribues = new ArrayCollection();
        $this->demandeEchantillons = new ArrayCollection();
        $this->documents = new ArrayCollection(); // ← AJOUTER

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
                $lot->setMp(null); // on dissocie le lot de la matière première avant juste de le supprimer de la collection pour éviter les problèmes d'intégrité référentielle
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
