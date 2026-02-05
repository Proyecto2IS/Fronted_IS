import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-estudiante-solicitudes',
  templateUrl: './estudiante-solicitudes.page.html',
  styleUrls: ['./estudiante-solicitudes.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EstudianteSolicitudesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
