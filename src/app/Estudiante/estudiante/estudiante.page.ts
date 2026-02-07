import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardContent } from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import {
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonCard,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  logOutOutline,
  hourglassOutline,
  checkmarkDoneOutline,
  statsChartOutline,
  addCircleOutline,
  chevronForwardOutline,
  mailOutline,
  bookOutline,
  calendarOutline,
  documentTextOutline,
  personOutline,
  timeOutline,
  calendarClearOutline
} from 'ionicons/icons';

interface Tutoria {
  id: number;
  materia: string;
  docente: string;
  fecha: string;
  hora: string;
  estado: string;
}

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.page.html',
  styleUrls: ['./estudiante.page.scss'],
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
export class EstudiantePage implements OnInit {

 nombreEstudiante: string = '';
  solicitudesPendientes: number = 2;
  tutoriasConfirmadas: number = 4;
  totalTutorias: number = 15;

  proximasTutorias: Tutoria[] = [
    {
      id: 1,
      materia: 'Cálculo Diferencial',
      docente: 'Dr. Juan Pérez',
      fecha: '2026-02-06',
      hora: '10:00 AM - 11:00 AM',
      estado: 'Confirmada'
    },
    {
      id: 2,
      materia: 'Programación I',
      docente: 'Ing. María Rodríguez',
      fecha: '2026-02-07',
      hora: '02:00 PM - 03:00 PM',
      estado: 'Pendiente'
    },
    {
      id: 3,
      materia: 'Física I',
      docente: 'Dr. Carlos Mendoza',
      fecha: '2026-02-08',
      hora: '09:00 AM - 10:00 AM',
      estado: 'Confirmada'
    }
  ];

  constructor(private router: Router) {
    // Registrar los íconos
    addIcons({
      'person-circle-outline': personCircleOutline,
      'log-out-outline': logOutOutline,
      'hourglass-outline': hourglassOutline,
      'checkmark-done-outline': checkmarkDoneOutline,
      'stats-chart-outline': statsChartOutline,
      'add-circle-outline': addCircleOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'mail-outline': mailOutline,
      'book-outline': bookOutline,
      'calendar-outline': calendarOutline,
      'document-text-outline': documentTextOutline,
      'person-outline': personOutline,
      'time-outline': timeOutline,
      'calendar-clear-outline': calendarClearOutline
    });
  }

  ngOnInit() {
    const usuarioStorage = localStorage.getItem('usuario');

  if (usuarioStorage) {
    const usuario = JSON.parse(usuarioStorage);

    // Ajusta según cómo venga tu backend
    this.nombreEstudiante = usuario.nombre; 
    
  }
  }

  navigateToSolicitar() {
    console.log('Navegar a solicitar tutoría');
    // this.router.navigate(['/estudiante/solicitar-tutoria']);
  }

  navigateToMisSolicitudes() {
    console.log('Navegar a mis solicitudes');
    // this.router.navigate(['/estudiante/estudiante-solicitudes']);
  }

  navigateToHistorial() {
    console.log('Navegar a historial');
    // this.router.navigate(['/estudiante/estudiante-historial']);
  }

  navigateToCalendario() {
    console.log('Navegar a calendario');
    // this.router.navigate(['/estudiante/calendario']);
  }

  navigateToReportes() {
    console.log('Navegar a reportes');
    // this.router.navigate(['/estudiante/reportes']);
  }

  getTutoriaColor(estado: string): string {
    const colores: { [key: string]: string } = {
      'Confirmada': 'success',
      'Pendiente': 'warning',
      'Cancelada': 'danger',
      'Rechazada': 'danger',
      'Completada': 'medium'
    };
    return colores[estado] || 'medium';
  }

  onLogout() {
    console.log('Cerrar sesión');
    this.router.navigate(['/login']);
    // Aquí irá la lógica de cierre de sesión
    // this.router.navigate(['/login']);
  }
}
