import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatpremService } from '../services/matiere-premiere.service';
import { MatierePremiere } from '../models/matiere-premiere.model';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mp-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './matieres-premieres.component.html',
  styleUrl: './matieres-premieres.component.css',
})
export class MpList implements OnInit {

  mp$!: Observable<Array<MatierePremiere>>;

  constructor(
    private mpservice: MatpremService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.mp$ = this.mpservice.mplist();

    this.mp$.subscribe({
      next: (mps) => {
        console.log('mp recus :', mps);
        console.log('premiere mp :', mps[0]);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des matieres premieres :', error);
      }
    });
  }
}