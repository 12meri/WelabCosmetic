import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',  
  imports: [CommonModule],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  homeData: any = null;

  constructor(private http: HttpClient) {}

 ngOnInit() {
    console.log('🟡 Appel API...');
    this.http.get('http://localhost:8011/api/home').subscribe({
      next: (data) => {
        console.log('🟢 Données reçues:', data);
        this.homeData = data;  // ← Les données sont stockées
      },
      error: (err) => {
        console.error('🔴 Erreur:', err);
      }
    });
  }
}