import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-estudiante-historial',
  templateUrl: './estudiante-historial.page.html',
  styleUrls: ['./estudiante-historial.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EstudianteHistorialPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
