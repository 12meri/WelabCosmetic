import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FournisseurService } from '../../../services/fournisseur.service';
import { FournirService } from '../../../services/fournir.service';
import { MatpremService } from '../../../services/matiere-premiere.service';
import { DistributionService } from '../../../services/distribution.service';
import { Fournisseur } from '../../../models/fournisseur.model';
import { Fournir } from '../../../models/fournir.model';
import { MatierePremiere } from '../../../models/matiere-premiere.model';
import { Distribution } from '../../../models/distribution.model';
import { ModalEditFournirComponent } from "./fournir-edit/fournir-edit.component";
import { ModalFournirComponent } from "./fournir/fournir.component";

@Component({
  selector: 'app-fournisseur-detail',
  templateUrl: './fournisseur-detail.component.html',
  styleUrls: ['./fournisseur-detail.component.css'],
  imports: [ModalEditFournirComponent, ModalFournirComponent]
})
export class FournisseurDetailComponent implements OnInit {
  fournisseur: Fournisseur | null = null;
  fournitures: Fournir[] = [];
  matieres: MatierePremiere[] = [];
  distributions: Distribution[] = [];

  // Modals
  showModalFournir = false;
  showModalEditFournir = false;
  selectedFournir: Fournir | null = null;

  constructor(
    private route: ActivatedRoute,
    private fournisseurService: FournisseurService,
    private fournirService: FournirService,
    private mpService: MatpremService,
    private distributionService: DistributionService,
        private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id']; // 
    if (id) {
      this.loadFournisseur(+id);
      this.loadFournitures(+id);
      this.loadMatieres();
      this.loadDistributions();
    }
this.cdr.markForCheck(); // Force la détection après les chargements initiaux

}

   loadMatieres(): void {
    this.mpService.mplist().subscribe({
      next: (data) => {
        this.matieres= data; // stocke les matières premières localement
         this.cdr.markForCheck(); // force la détection après chargement des matières premières
        console.log('Matières premières chargées :', data);
      },
      error: (error) => {
        console.error('Erreur chargement matières premières :', error);
      }
    });
  }


  loadDistributions(): void {
    this.distributionService.list().subscribe({
        next: (data) => {
          this.distributions = data;
          this.cdr.markForCheck();
        }
      });
  }

  loadFournisseur(id: number): void {
    this.fournisseurService.getById(id).subscribe(data => this.fournisseur = data);
        this.cdr.markForCheck();

  }

  
 loadFournitures(fournisseurId: number): void {
  this.fournirService.getAll().subscribe({
    next: (data) => {
      console.log('Toutes les fournitures :', data);
      // Filtrer celles qui appartiennent au fournisseur courant
      const filtered = data.filter(f => {
        const fournIRI = typeof f.fournisseur === 'string' 
          ? f.fournisseur 
          : `/api/fournisseurs/${f.fournisseur.id}`;
        return fournIRI === `/api/fournisseurs/${fournisseurId}`;
      });
      this.fournitures = filtered;
      console.log('Fournitures filtrées :', this.fournitures);
          this.cdr.markForCheck();

    },
    error: (err) => console.error('Erreur chargement fournitures :', err)
  });
}
 

getMatPremNom(value: string | MatierePremiere | undefined): string {
  if (!value) return '';

  // Si c'est une chaîne (IRI)
  if (typeof value === 'string') {
    const id = value.split('/').pop();
    const mp = this.matieres.find(m => String(m.id) === id);
    return mp ? mp.nomMP : value;
  }

  // Si c'est un objet MatierePremiere (rare ici, mais sécurité)
  const mp = this.matieres.find(m => m.id === value.id);
  return mp ? mp.nomMP : (value.nomMP || 'MP inconnue');
}

getDistribNom(value: string | Distribution |null | undefined): string {
  if (!value) return 'Toutes marques';

  if (typeof value === 'string') {
    const id = value.split('/').pop();
    const dist = this.distributions.find(d => String(d.id) === id);
    return dist ? (dist.nomMarque  || value) : value;
  }

  // Si c'est un objet Distribution
  const dist = this.distributions.find(d => d.id === value.id);
  return dist ? (dist.nomMarque ) : (value.nomMarque ||  'Marque inconnue');
}
  openAddFournir(): void {
    this.selectedFournir = null;
    this.showModalFournir = true;
  }

  openEditFournir(fournir: Fournir): void {
    this.selectedFournir = fournir;
    this.showModalEditFournir = true;
  }

  deleteFournir(id: number): void {
    if (confirm('Supprimer cette fourniture ?')) {
      this.fournirService.delete(id).subscribe(() => {
        this.loadFournitures(this.fournisseur!.id!);
      });
    }
  }

  onFournirSaved(): void {
    this.showModalFournir = false;
    this.showModalEditFournir = false;
    this.loadFournitures(this.fournisseur!.id!);
  }
}