import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from '../services/AuthenticationService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';

  get isValid() {
    return this.username !== '' && this.password !== '';
  }

  constructor(public auth: AuthenticationService) {}

  login() {
    this.auth.login(this.username, this.password);
  }
}