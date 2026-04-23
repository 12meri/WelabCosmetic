import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatpremService } from '../../../services/matiere-premiere.service';
import { MatierePremiere } from '../../../models/matiere-premiere.model';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-mp-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mp-edit.html',
  styleUrl: './mp-edit.css',
})
export class MpEdit implements OnInit {

  mp: MatierePremiere = {
    nomMP: '',
    INCI: '',
    NOI: '',
    categorie: '',
    fonction: '',
    cosmos: ''
  };

  id!: number;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private matpremService: MatpremService,
    private notificationService: NotificationService, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.id = Number(idParam);
      this.loadMp();      
    } else {
      this.errorMessage = '❌ ID introuvable';
    }
  }

  // Appelle la méthode publique du service – pas de redondance
  getCategorieFromNom(): string {
    return this.matpremService.getCategorieFromNom(this.mp.nomMP);
  }

  loadMp(): void {
    this.isLoading = true;
    this.matpremService.getMpById(this.id).subscribe({
      next: (data) => {
        this.mp = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur chargement :', error);
        this.errorMessage = 'Erreur lors du chargement';
        this.isLoading = false;
      }
    });
  }

  updateMp(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.matpremService.updateMp(this.id, this.mp).subscribe({
      next: (success) => {
        if (success) {
          this.notificationService.showMessage(' Matière première modifiée avec succès !');
        this.router.navigate(['/matpremieres']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur modification :', error);
        this.errorMessage = ' Erreur lors de la modification';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/matpremieres']);
  }
}