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
  templateUrl: './mp-edit.component.html',
  styleUrl: './mp-edit.component.css',
})
export class MpEdit implements OnInit {

  // Initialisation d'une matière première vide pour le formulaire en code creation 
  // cest aussi la structure de base pour éviter les erreurs de liaison dans le template avant que les données ne soient chargées depuis le backend. 
  mp: MatierePremiere = {
    nomMP: '',
    INCI: '',
    NOI: '',
    categorie: '',
    fonction: '',
    cosmos: ''
  };

  id!: number; // l'ID de la matière première à modifier, récupéré depuis les paramètres de l'URL
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

  /**
   * La méthode loadMp est responsable de charger les données d'une matière première spécifique à partir du backend Symfony en utilisant le service MatpremService. 
   * Elle utilise l'ID de la matière première, récupéré depuis les paramètres de l'URL, pour envoyer une requête GET au backend et obtenir les détails de la matière première correspondante. Pendant le chargement, elle gère l'état de chargement et affiche des messages d'erreur en cas de problème.
   */
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

  /**
   * La méthode updateMp est responsable de mettre à jour les données d'une matière première spécifique dans le backend Symfony en utilisant le service MatpremService. 
   * Elle utilise l'ID de la matière première, récupéré depuis les paramètres de l'URL, pour envoyer une requête PUT au backend et modifier les détails de la matière première correspondante. Pendant la mise à jour, elle gère l'état de chargement et affiche des messages d'erreur en cas de problème.
   */
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

  // La méthode cancel est responsable de gérer l'annulation de la modification d'une matière première.  
  cancel(): void {
    this.router.navigate(['/matpremieres']);
  }
}