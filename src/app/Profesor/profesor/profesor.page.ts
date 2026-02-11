
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
  solicitudesPendientes: number = 0;
  tutoriasHoy: number = 0;
  tutoriasSemanales: number = 0;


  proximasTutorias: Tutoria[] = [];
  materiasMap = new Map<number, string>();
  estudiantesMap = new Map<number, string>();
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
    this.cargarCatalogos();
  }
}
cargarCatalogos() {
  Promise.all([
    this.tutoriaService.getMaterias().toPromise(),
    this.tutoriaService.getEstudiantes().toPromise()
  ]).then(([materias, estudiantes]) => {

    (materias || []).forEach(m =>
      this.materiasMap.set(m.id, m.nombre)
    );

    (estudiantes || []).forEach(e =>
      this.estudiantesMap.set(e.id, e.nombre)
    );

    // 👇 recién aquí cargas tutorías
    this.cargarTutorias();
  });
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
   this.router.navigate(['/profesor-historial']);
  }

  navigateToCalendario() {
    console.log('Navegar a calendario');
    this.router.navigate(['calendario']);
  }
  cargarTutorias() {

  this.tutoriaService.getTutoriasDocente()
    .subscribe((resp: any[]) => {

      if (!resp) return;

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const inicioSemana = new Date(hoy);
      inicioSemana.setDate(hoy.getDate() - hoy.getDay());

      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);

      // 🔹 Pendientes
      this.solicitudesPendientes =
        resp.filter(t => t.estado === 'pendiente').length;

      // 🔹 Tutorías hoy
      this.tutoriasHoy =
        resp.filter(t => {
          const fechaTutoria = new Date(t.fecha);
          fechaTutoria.setHours(0,0,0,0);
          return fechaTutoria.getTime() === hoy.getTime();
        }).length;

      // 🔹 Tutorías semanales
      this.tutoriasSemanales =
        resp.filter(t => {
          const fechaTutoria = new Date(t.fecha);
          return fechaTutoria >= inicioSemana &&
                 fechaTutoria <= finSemana;
        }).length;

      // 🔹 Próximas tutorías (solo confirmadas y futuras)
      this.proximasTutorias =
        resp
          .filter(t => {
            const fechaTutoria = new Date(t.fecha);
            return fechaTutoria >= hoy &&
                   t.estado === 'confirmada';
          })
          .sort((a, b) =>
            new Date(a.fecha).getTime() -
            new Date(b.fecha).getTime()
          )
          .slice(0, 3) // solo 3 próximas
          .map(t => ({
  id: t.id,
  materia: this.materiasMap.get(t.materia_id) || 'Materia no encontrada',
  estudiante: this.estudiantesMap.get(t.estudiante_id) || 'Estudiante no encontrado',
  fecha: t.fecha,
  hora: `${t.hora_inicio} - ${t.hora_fin}`,
  estado: this.formatearEstado(t.estado)
}));
    });
}
formatearEstado(estado: string): string {

  switch (estado) {
    case 'confirmada': return 'Confirmada';
    case 'pendiente': return 'Pendiente';
    case 'cancelada': return 'Cancelada';
    case 'finalizada': return 'Completada';
    default: return estado;
  }
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
