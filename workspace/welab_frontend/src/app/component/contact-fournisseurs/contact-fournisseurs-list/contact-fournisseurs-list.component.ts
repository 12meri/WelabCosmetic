import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { Observable } from "rxjs";
import { AsyncPipe, CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { ContactFournisseurService } from "../../../services/contact-fournisseur.service";
import { FournisseurService } from "../../../services/fournisseur.service";
import { ContactFournisseur } from "../../../models/contact-fournisseur.model";
import { Fournisseur } from "../../../models/fournisseur.model";

@Component({
  selector: "app-contact-fournisseurs-list",
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink],
  templateUrl: "./contact-fournisseurs-list.component.html",
  styleUrl: "./contact-fournisseurs-list.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactFournisseursList implements OnInit {
  /** Observable pour la liste des contacts */

  contacts$!: Observable<ContactFournisseur[]>;
  fournisseurs: Fournisseur[] = [];

  showDeleteModal = false;
  selectedId: number | null = null;
  successMessage = "";
  errorMessage = "";

  constructor(
    private contactService: ContactFournisseurService,
    private fournisseurService: FournisseurService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadContacts();
    this.loadFournisseurs();
  }

  loadContacts(): void {
    this.contacts$ = this.contactService.list();
    this.cdr.markForCheck();
  }

  loadFournisseurs(): void {
    this.fournisseurService.list().subscribe({
      next: (data) => {
        this.fournisseurs = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error("Erreur chargement fournisseurs :", error);
      }
    });
  }

  getFournisseurName(iri: string | undefined): string {
    if (!iri) return "";
    const id = iri.split("/").pop();
    const found = this.fournisseurs.find(f => String(f.id) === id);
    return found ? found.nomEntr : iri;
  }

  trackById(index: number, item: ContactFournisseur) {
    return item.id;
  }

  openDeleteModal(id: number): void {
    this.selectedId = id;
    this.showDeleteModal = true;
    this.cdr.markForCheck();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedId = null;
    this.cdr.markForCheck();
  }

  confirmDelete(): void {
    if (this.selectedId === null) return;

    this.successMessage = "";
    this.errorMessage = "";

    this.contactService.delete(this.selectedId).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = " Contact supprimé avec succès";
          this.loadContacts();
        } else {
          this.errorMessage = " La suppression a échoué";
        }
        this.closeDeleteModal();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error("Erreur suppression :", error);
        this.errorMessage =
          error?.error?.detail ||
          error?.error?.message ||
          " Erreur lors de la suppression";
        this.closeDeleteModal();
        this.cdr.markForCheck();
      }
    });
  }
}
