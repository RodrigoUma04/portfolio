import { Component } from '@angular/core';
import { Header } from './layout/header/header';
import { Body } from './layout/body/body';

@Component({
  selector: 'app-root',
  imports: [Header, Body],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: { class: 'flex flex-col h-dvh' }
})
export class App {}
