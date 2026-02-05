import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-profesor-historial',
  templateUrl: './profesor-historial.page.html',
  styleUrls: ['./profesor-historial.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProfesorHistorialPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
