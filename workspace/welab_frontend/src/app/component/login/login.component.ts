// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authenticationService';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule , RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  // La propriété isValid est un getter qui vérifie si les champs email et password ne sont pas vides.
  get isValid(): boolean {
    return this.email !== '' && this.password !== '';
  }

  constructor(public auth: AuthenticationService) {}

  // La méthode login est responsable de gérer le processus de connexion de l'utilisateur.
  login(): void {
    this.errorMessage = '';
    this.auth.login(this.email, this.password);
  }
}