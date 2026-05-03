import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ContactFournisseurService } from "../../../services/contact-fournisseur.service";
import { FournisseurService } from "../../../services/fournisseur.service";
import { ContactFournisseur } from "../../../models/contact-fournisseur.model";
import { Fournisseur } from "../../../models/fournisseur.model";

@Component({
  selector: "app-contact-fournisseurs-edit",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./contact-fournisseurs-edit.component.html",
  styleUrl: "./contact-fournisseurs-edit.component.css",
})
export class ContactFournisseursEdit implements OnInit {
  /** Contact à modifier */

  contact: ContactFournisseur = {
    nom: "",
    prenom: "",
    fonction: "",
    email: "",
    telContact: "",
    fournisseur: ""
  };

  fournisseurs: Fournisseur[] = [];
  id!: number;
  isLoading = false;
  isLoadingData = true;   // ← chargeur global
  successMessage = "";
  errorMessage = "";

  constructor(
    private contactService: ContactFournisseurService,
    private fournisseurService: FournisseurService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (!idParam) {
      this.errorMessage = " ID introuvable";
      this.isLoadingData = false;
      return;
    }
    this.id = Number(idParam);
    this.loadAll();
  }

  loadAll(): void {
    this.isLoadingData = true;
    forkJoin({
      contact: this.contactService.getById(this.id),
      fournisseurs: this.fournisseurService.list()
    }).subscribe({
      next: (data) => {
        this.contact = data.contact;
        this.fournisseurs = data.fournisseurs;
        this.isLoadingData = false;
        this.cdr.detectChanges();   // ← forcer l'affichage immédiat
      },
      error: (err) => {
        console.error("Erreur chargement :", err);
        this.errorMessage = " Erreur lors du chargement des données";
        this.isLoadingData = false;
        this.cdr.detectChanges();
      }
    });
  }

  getFournisseurIri(fournisseur: Fournisseur): string {
    return `/api/fournisseurs/${fournisseur.id}`;
  }

  update(): void {
    this.isLoading = true;
    this.successMessage = "";
    this.errorMessage = "";

    this.contactService.update(this.id, this.contact).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = " Contact modifié avec succès !";
          setTimeout(() => {
            this.router.navigate(["/contact-fournisseurs"]);
          }, 2000);
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Erreur modification :", error);
        this.errorMessage =
          error?.error?.detail ||
          error?.error?.message ||
          " Erreur lors de la modification";
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel(): void {
    this.router.navigate(["/contact-fournisseurs"]);
  }
}