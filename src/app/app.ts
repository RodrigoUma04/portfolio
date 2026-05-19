import { Component } from '@angular/core';
import { Header } from './layout/header/header';
import { Body } from './layout/body/body';
import { Footer } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Header, Body, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: { class: 'flex flex-col min-h-dvh' }
})
export class App {}
