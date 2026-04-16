import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ContactFournisseurService } from "../../../services/contact-fournisseur.service";
import { FournisseurService } from "../../../services/fournisseur.service";
import { ContactFournisseur } from "../../../models/contact-fournisseur.model";
import { Fournisseur } from "../../../models/fournisseur.model";

@Component({
  selector: "app-contact-fournisseurs-edit",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./contact-fournisseurs-edit.html",
  styleUrl: "./contact-fournisseurs-edit.css",
})
export class ContactFournisseursEdit implements OnInit {

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
  successMessage = "";
  errorMessage = "";

  constructor(
    private contactService: ContactFournisseurService,
    private fournisseurService: FournisseurService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.id = Number(idParam);
      this.load();
    } else {
      this.errorMessage = "❌ ID introuvable";
    }
    this.loadFournisseurs();
  }

  load(): void {
    this.isLoading = true;
    this.contactService.getById(this.id).subscribe({
      next: (data) => {
        this.contact = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erreur chargement :", error);
        this.errorMessage = "❌ Erreur lors du chargement";
        this.isLoading = false;
      }
    });
  }

  loadFournisseurs(): void {
    this.fournisseurService.list().subscribe({
      next: (data) => { this.fournisseurs = data; },
      error: (error) => { console.error("Erreur fournisseurs :", error); }
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
          this.successMessage = "✅ Contact modifié avec succès !";
          setTimeout(() => {
            this.router.navigate(["/contact-fournisseurs"]);
          }, 2000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erreur modification :", error);
        this.errorMessage =
          error?.error?.detail ||
          error?.error?.message ||
          "❌ Erreur lors de la modification";
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(["/contact-fournisseurs"]);
  }
}
