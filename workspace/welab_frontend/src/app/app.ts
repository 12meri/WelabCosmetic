import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Menu } from './menu/menu';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HomeComponent , Menu , Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
