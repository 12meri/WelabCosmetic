// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authenticationService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  get isValid(): boolean {
    return this.email !== '' && this.password !== '';
  }

  constructor(public auth: AuthenticationService) {}

  login(): void {
    this.errorMessage = '';
    this.auth.login(this.email, this.password);
  }
}