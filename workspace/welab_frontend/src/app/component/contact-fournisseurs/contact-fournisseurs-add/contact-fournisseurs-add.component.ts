import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ContactFournisseurService } from "../../../services/contact-fournisseur.service";
import { FournisseurService } from "../../../services/fournisseur.service";
import { ContactFournisseur } from "../../../models/contact-fournisseur.model";
import { Fournisseur } from "../../../models/fournisseur.model";

@Component({
  selector: "app-contact-fournisseurs-add",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./contact-fournisseurs-add.component.html",
  styleUrl: "./contact-fournisseurs-add.component.css",
})
export class ContactFournisseursAdd implements OnInit {
  /** Modèle du formulaire pour créer un contact fournisseur */

  contact: ContactFournisseur = {
    nom: "",
    prenom: "",
    fonction: "",
    email: "",
    telContact: "",
    fournisseur: ""
  };

  fournisseurs: Fournisseur[] = [];
  isLoading = false;
  isLoadingFournisseurs = false;
  successMessage = "";
  errorMessage = "";

  constructor(
    private contactService: ContactFournisseurService,
    private fournisseurService: FournisseurService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs(): void {
    this.isLoadingFournisseurs = true;
    this.fournisseurService.list().subscribe({
      next: (data) => {
        this.fournisseurs = data;
        this.isLoadingFournisseurs = false;

        // Après avoir chargé les fournisseurs, vérifier s'il y a un fournisseurId en query param pour pré-sélectionner le fournisseur
        this.preselectFournisseurFromQuery();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Erreur chargement fournisseurs :", error);
        this.errorMessage = "❌ Impossible de charger les fournisseurs";
        this.isLoadingFournisseurs = false;
      }
    });
  }
  // Si un fournisseurId est passé en query param, le pré-sélectionner dans le formulaire
  preselectFournisseurFromQuery(): void {
    const fournisseurId = this.route.snapshot.queryParamMap.get('fournisseurId');
    if (fournisseurId) {
      const found = this.fournisseurs.find(f => f.id === Number(fournisseurId));
      if (found) {
        this.contact.fournisseur = this.getFournisseurIri(found);
      } else {
        console.warn(`Fournisseur with id ${fournisseurId} not found`);
      }
    }
  }

  getFournisseurIri(fournisseur: Fournisseur): string {
    return `/api/fournisseurs/${fournisseur.id}`;
  }

  create(): void {
    this.isLoading = true;
    this.successMessage = "";
    this.errorMessage = "";

    this.contactService.create(this.contact).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = " Contact créé avec succès !";
          this.resetForm();
          setTimeout(() => {
            this.router.navigate(["/contact-fournisseurs"]);
          }, 2000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erreur création :", error);
        this.errorMessage =
          error?.error?.detail ||
          error?.error?.message ||
          " Erreur lors de la création";
        this.isLoading = false;
      }
    });
  }

  // Méthode pour réinitialiser le formulaire après création réussie
  resetForm(): void {
    this.contact = { nom: "", prenom: "", fonction: "", email: "", telContact: "", fournisseur: "" };
  }

  cancel(): void {
    this.router.navigate(["/contact-fournisseurs"]);
  }
}
