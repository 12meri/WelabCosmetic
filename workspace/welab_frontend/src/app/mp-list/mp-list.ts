import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatpremService } from '../services/matprem-service';
import { MatPre } from '../entity/mat-pre';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
@Component({
  selector: 'app-mp-list',
  imports: [AsyncPipe,RouterLink, CommonModule],
  templateUrl: './mp-list.html',
  styleUrl: './mp-list.css',
})
export class MpList implements OnInit{

  mp$!:Observable<Array<MatPre>>; // ! pour dire que ca sera initialiser apres 
  isLoading = false;
  errorMessage = '';
   
  
  private mpservice: MatpremService;

  constructor( mpservice: MatpremService){
    this.mpservice=mpservice;
  }

  ngOnInit(): void{
    // this.mp$= this.mpservice.mplist();
    // this.mp$.subscribe(mps => {
    //   console.log('mp recus:', mps);
    //   console.log('premiere mp', mps[0]);
    // })
    this.loadMpList(); // appel de la methode 
  }

  // methode pour appeler la liste apres verification de changement
  loadMpList(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.mp$ = this.mpservice.mplist();

    this.mp$.subscribe({
      next: (mps) => { 
        console.log('mp recus',mps);
        console.log('premiere mp',mps[0]);
        this.isLoading = false;
      },
      error: (error)=>{  
        console.error('Erreur lors du chargement:', error);
        this.errorMessage= ' Erreur lors du chargement des matieres premieres';
        this.isLoading = false;

      }
    })
  }

  // optionnel : methode pour recharger les donnees
  reload(): void{
    this.loadMpList();
  }

}
