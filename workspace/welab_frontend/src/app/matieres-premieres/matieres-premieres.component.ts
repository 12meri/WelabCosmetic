import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatierePremiereService } from '../services/matiere-premiere.service';
import { MatierePremiere } from '../models/matiere-premiere.model';
import { ApiResponse } from '../services/api-response';

@Component({
  selector: 'app-matieres-premieres',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matieres-premieres.component.html',
  styleUrl: './matieres-premieres.component.css'
})
export class MatieresPremieresComponent implements OnInit {

  matieres: MatierePremiere[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private matiereService: MatierePremiereService) {}

  ngOnInit(): void {
    this.chargerMatieres();
  }

  chargerMatieres(): void {
    this.loading = true;
    this.error = null;

    this.matiereService.getAllMatieres().subscribe({
      next: (data: ApiResponse<MatierePremiere>) => {
        console.log('Données reçues:', data);
        this.matieres = data.member;   // <-- LIGNE ESSENTIELLE
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur détaillée:', err);
        this.error = err.message || 
          'Impossible de charger les matières premières. Vérifiez que l’API est accessible.';
        this.loading = false;
      }
    });
  }

  supprimer(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette matière première ?')) {
      this.matiereService.deleteMatiere(id).subscribe({
        next: () => {
          this.chargerMatieres();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.error = 'Erreur lors de la suppression';
        }
      });
    }
  }
}
