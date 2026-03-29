import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MatpremService } from '../services/matprem-service';
import { MatPre } from '../entity/mat-pre';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
@Component({
  selector: 'app-mp-list',
  imports: [AsyncPipe,RouterLink],
  templateUrl: './mp-list.html',
  styleUrl: './mp-list.css',
})
export class MpList {

  mp$!:Observable<Array<MatPre>>; // ! pour dire que ca sera initialiser apres 
  private mpservice: MatpremService;

  constructor( mpservice: MatpremService){
    this.mpservice=mpservice;
  }

  ngOnInit(): void{
    this.mp$= this.mpservice.mplist();
    this.mp$.subscribe(mps => {
      console.log('mp recus:', mps);
      console.log('premiere mp', mps[0]);
    })
  }

}
