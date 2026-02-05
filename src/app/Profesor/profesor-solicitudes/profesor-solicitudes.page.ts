import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-profesor-solicitudes',
  templateUrl: './profesor-solicitudes.page.html',
  styleUrls: ['./profesor-solicitudes.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProfesorSolicitudesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
