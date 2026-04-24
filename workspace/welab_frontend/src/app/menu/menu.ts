// src/app/component/menu/menu.ts
// Adapte le selector selon ce que tu as dans app.component.html :
// si tu as <app-menu> → selector: 'app-menu'
// si tu as <app-nav>  → selector: 'app-nav'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from '../services/authenticationService';

@Component({
  selector: 'app-menu', // ← vérifie dans app.component.html
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  constructor(public auth: AuthenticationService) {}
}