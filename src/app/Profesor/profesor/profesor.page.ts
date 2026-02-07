
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TutoriasService } from '../../Services/tutoria.service';

import { Router } from '@angular/router';
import {
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  logOutOutline,
  timeOutline,
  calendarOutline,
  checkmarkCircleOutline,
  mailOutline,
  documentTextOutline,
  personOutline,
  calendarClearOutline
} from 'ionicons/icons';

interface Tutoria {
  id: number;
  materia: string;
  estudiante: string;
  fecha: string;
  hora: string;
  estado: string;
}
@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.page.html',
  styleUrls: ['./profesor.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonBadge
  ]

})
export class ProfesorPage implements OnInit {

  nombreProfesor: string = '';
  solicitudesPendientes: number = 5;
  tutoriasHoy: number = 3;
  tutoriasSemanales: number = 12;

  proximasTutorias: Tutoria[] = [
    {
      id: 1,
      materia: 'Cálculo Diferencial',
      estudiante: 'María González',
      fecha: '2026-02-06',
      hora: '10:00 AM - 11:00 AM',
      estado: 'Confirmada'
    },
    {
      id: 2,
      materia: 'Álgebra Lineal',
      estudiante: 'Carlos Ramírez',
      fecha: '2026-02-06',
      hora: '02:00 PM - 03:00 PM',
      estado: 'Confirmada'
    },
    {
      id: 3,
      materia: 'Cálculo Integral',
      estudiante: 'Ana Martínez',
      fecha: '2026-02-07',
      hora: '09:00 AM - 10:00 AM',
      estado: 'Pendiente'
    }
  ];

  constructor(private router: Router, private tutoriaService: TutoriasService) {
    // Registrar los íconos
    addIcons({
      'person-circle-outline': personCircleOutline,
      'log-out-outline': logOutOutline,
      'time-outline': timeOutline,
      'calendar-outline': calendarOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'mail-outline': mailOutline,
      'document-text-outline': documentTextOutline,
      'person-outline': personOutline,
      'calendar-clear-outline': calendarClearOutline
    });
  }

  ngOnInit() {

  }
  ionViewWillEnter() {
  const usuarioStorage = localStorage.getItem('usuario');

  if (usuarioStorage) {
    const usuario = JSON.parse(usuarioStorage);
    this.nombreProfesor = usuario.nombre;
    this.cargarTutorias();
  }
}

  navigateToDisponibilidad() {
    // Lógica de navegación
    console.log('Navegar a disponibilidad');
    // this.router.navigate(['/profesor/disponibilidad']);
  }

navigateToSolicitudes() {
  this.router.navigate(['/profesor-solicitudes']);
}


  navigateToHistorial() {
    console.log('Navegar a historial');
    // this.router.navigate(['/profesor/historial']);
  }

  navigateToCalendario() {
    console.log('Navegar a calendario');
    // this.router.navigate(['/profesor/calendario']);
  }
  cargarTutorias(){

   this.tutoriaService.getTutoriasDocente()
  .subscribe((resp:any)=>{

    this.proximasTutorias = resp;

    this.solicitudesPendientes =
      resp.filter((t:any)=> t.estado === 'pendiente').length;

  });

}

  getTutoriaColor(estado: string): string {
    const colores: { [key: string]: string } = {
      'Confirmada': 'success',
      'Pendiente': 'warning',
      'Cancelada': 'danger',
      'Completada': 'medium'
    };
    return colores[estado] || 'medium';
  }

  onLogout() {
    console.log('Cerrar sesión');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
