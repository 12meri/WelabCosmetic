// src/app/forgot-password/forgot-password.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email = '';
  sent = false;

  /**
   *  La méthode submit() est responsable de gérer la soumission du formulaire de mot de passe oublié.
   * @returns 
   */
  submit(): void {
    if (!this.email) return;
    // Pas de backend pour l'instant : on affiche juste la confirmation.
    // Quand le backend sera prêt, remplacer par un appel HTTP ici.
    this.sent = true;
  }
}