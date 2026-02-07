import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardContent } from '@ionic/angular/standalone';
import { TutoriasService } from '../../Services/tutoria.service';
import { TutoriaInterface } from 'src/app/Interfaces/tutoria.interface';
import { Router } from '@angular/router';
import {IonButtons,IonMenuButton,IonButton,IonIcon,IonCard,IonBadge} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {personCircleOutline,logOutOutline,hourglassOutline,checkmarkDoneOutline,statsChartOutline,addCircleOutline,chevronForwardOutline,mailOutline,bookOutline,calendarOutline,documentTextOutline,personOutline,timeOutline,calendarClearOutline} from 'ionicons/icons';
@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.page.html',
  styleUrls: ['./estudiante.page.scss'],
  standalone: true,
   imports: [CommonModule,FormsModule,IonHeader,IonToolbar,IonTitle,IonContent,IonButtons,IonMenuButton,IonButton,IonIcon,IonCard,IonCardContent,IonBadge]
})
export class EstudiantePage implements OnInit {
tutorias: TutoriaInterface[] = [];
 nombreEstudiante: string = '';
 solicitudesPendientes = 0;
tutoriasConfirmadas = 0;
totalTutorias = 0;


  proximasTutorias: any[] = [];

  constructor(
    private router: Router,
  private tutoriaService: TutoriasService,
) {
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
    this.nombreEstudiante = usuario.nombre;
  }

  this.cargarTutorias();
  this.cargarEstadisticas();

}
cargarEstadisticas() {
  this.tutoriaService.obtenerTutoriasEstudiante().subscribe({
    next: (data) => {

      this.tutorias = data;

      // 🔹 Total
      this.totalTutorias = data.length;

      // 🔹 Pendientes
      this.solicitudesPendientes = data.filter(t =>
        t.estado === 'pendiente'
      ).length;

      // 🔹 Confirmadas
      this.tutoriasConfirmadas = data.filter(t =>
        t.estado === 'confirmada'
      ).length;

      // 🔹 Próximas tutorías (confirmadas y futuras)
      const hoy = new Date();

      this.proximasTutorias = data
        .filter(t =>
          t.estado === 'confirmada' &&
          new Date(t.fecha) >= hoy
        )
        .map(t => ({
          id: t.id,
          materia: 'Materia', // si no viene el nombre debes mapearlo desde backend
          docente: 'Docente', // igual aquí
          estado: this.formatearEstado(t.estado),
          fecha: t.fecha,
          hora: t.hora_inicio
        }));

    },
    error: (err) => {
      console.error('Error cargando estadísticas', err);
    }
  });
}

cargarTutorias() {


  this.tutoriaService.obtenerTutoriasEstudiante()
    .subscribe({
      next: (data) => {

        // Filtrar próximas (no finalizadas) y transformar para la vista
        const activas = data.filter(t => t.estado !== 'finalizada');
        this.proximasTutorias = activas.map(t => ({
        id: t.id!,
        fecha: t.fecha,
        hora: `${t.hora_inicio} - ${t.hora_fin}`,
        estado: this.formatearEstado(t.estado),
        docente_id: t.docente_id
      }));


      },
      error: (err) => {
        console.error('Error cargando tutorías', err);
      }
    });
}

formatearEstado(estado?: string): string {
  if (!estado) return 'Pendiente';

  const map: any = {
    pendiente: 'Pendiente',
    confirmada: 'Confirmada',
    cancelada: 'Cancelada',
    rechazada: 'Rechazada',
    finalizada: 'Completada'
  };

  return map[estado] || estado;
}

  navigateToSolicitar() {
    console.log('Navegar a solicitar tutoría');
    this.router.navigate(['solicitar-tutoria']);
  }

  navigateToMisSolicitudes() {
    console.log('Navegar a mis solicitudes');
    this.router.navigate(['/estudiante-solicitudes']);
  }

  navigateToHistorial() {
    console.log('Navegar a historial');
    this.router.navigate(['/estudiante-historial']);
  }

  navigateToCalendario() {
    console.log('Navegar a calendario');
    this.router.navigate(['/calendario']);
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
