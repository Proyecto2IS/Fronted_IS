import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import {
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonBadge,
  IonItem,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  refreshOutline,
  timeOutline,
  bookOutline,
  personOutline,
  calendarOutline,
  sendOutline,
  closeCircleOutline,
  checkmarkCircleOutline,
  checkmarkDoneOutline,
  addCircleOutline,
  calendarClearOutline,
  filterOutline,
  swapHorizontalOutline,
  checkmarkCircle,
  checkmarkOutline,
  eyeOutline,
  folderOpenOutline
} from 'ionicons/icons';

interface AlternativaPropuesta {
  fecha: string;
  hora: string;
}

interface Solicitud {
  id: number;
  materia: string;
  docente: string;
  docenteEmail: string;
  fecha: string;
  hora: string;
  tiempoTranscurrido?: string;
  fechaConfirmacion?: string;
  fechaProcesada?: string;
  estado: string;
  alternativasPropuestas?: AlternativaPropuesta[];
  alternativaSeleccionada?: number | null;
  respondida?: boolean;
}
@Component({
  selector: 'app-estudiante-solicitudes',
  templateUrl: './estudiante-solicitudes.page.html',
  styleUrls: ['./estudiante-solicitudes.page.scss'],
  standalone: true,
 imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonBadge,
    IonItem,
    IonSelect,
    IonSelectOption
  ]
})
export class EstudianteSolicitudesPage implements OnInit {

 tabActivo: string = 'pendientes';
  filtroProcesadas: string = 'todas';

  solicitudesPendientes: Solicitud[] = [];
  solicitudesConfirmadas: Solicitud[] = [];
  solicitudesProcesadas: Solicitud[] = [];
  solicitudesProcesadasFiltradas: Solicitud[] = [];

  constructor(private router: Router) {
    // Registrar los íconos
    addIcons({
      'refresh-outline': refreshOutline,
      'time-outline': timeOutline,
      'book-outline': bookOutline,
      'person-outline': personOutline,
      'calendar-outline': calendarOutline,
      'send-outline': sendOutline,
      'close-circle-outline': closeCircleOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'checkmark-done-outline': checkmarkDoneOutline,
      'add-circle-outline': addCircleOutline,
      'calendar-clear-outline': calendarClearOutline,
      'filter-outline': filterOutline,
      'swap-horizontal-outline': swapHorizontalOutline,
      'checkmark-circle': checkmarkCircle,
      'checkmark-outline': checkmarkOutline,
      'eye-outline': eyeOutline,
      'folder-open-outline': folderOpenOutline
    });
  }

  ngOnInit() {
    console.log('Página de solicitudes del estudiante inicializada');
    this.cargarDatosEjemplo();
    this.aplicarFiltroProcesadas();
  }

  cargarDatosEjemplo() {
    // Solicitudes pendientes (esperando respuesta del docente)
    this.solicitudesPendientes = [
      {
        id: 1,
        materia: 'Cálculo Diferencial',
        docente: 'Dr. Juan Pérez',
        docenteEmail: 'juan.perez@universidad.edu.ec',
        fecha: '2026-02-10',
        hora: '10:00 AM - 11:00 AM',
        tiempoTranscurrido: '2 horas',
        estado: 'Pendiente'
      },
      {
        id: 2,
        materia: 'Programación I',
        docente: 'Ing. María Rodríguez',
        docenteEmail: 'maria.rodriguez@universidad.edu.ec',
        fecha: '2026-02-11',
        hora: '02:00 PM - 03:00 PM',
        tiempoTranscurrido: '5 horas',
        estado: 'Pendiente'
      }
    ];

    // Solicitudes confirmadas (aceptadas por el docente)
    this.solicitudesConfirmadas = [
      {
        id: 3,
        materia: 'Física I',
        docente: 'Dr. Carlos Mendoza',
        docenteEmail: 'carlos.mendoza@universidad.edu.ec',
        fecha: '2026-02-08',
        hora: '09:00 AM - 10:00 AM',
        fechaConfirmacion: '2026-02-05',
        estado: 'Confirmada'
      },
      {
        id: 4,
        materia: 'Álgebra Lineal',
        docente: 'Dra. Ana Torres',
        docenteEmail: 'ana.torres@universidad.edu.ec',
        fecha: '2026-02-09',
        hora: '11:00 AM - 12:00 PM',
        fechaConfirmacion: '2026-02-06',
        estado: 'Confirmada'
      },
      {
        id: 5,
        materia: 'Cálculo Integral',
        docente: 'Dr. Juan Pérez',
        docenteEmail: 'juan.perez@universidad.edu.ec',
        fecha: '2026-02-12',
        hora: '03:00 PM - 04:00 PM',
        fechaConfirmacion: '2026-02-06',
        estado: 'Confirmada'
      }
    ];

    // Solicitudes procesadas (rechazadas o canceladas)
    this.solicitudesProcesadas = [
      {
        id: 6,
        materia: 'Estadística',
        docente: 'Lic. Roberto Vega',
        docenteEmail: 'roberto.vega@universidad.edu.ec',
        fecha: '2026-02-07',
        hora: '04:00 PM - 05:00 PM',
        fechaProcesada: 'Rechazada el 2026-02-04',
        estado: 'Rechazada',
        alternativasPropuestas: [
          { fecha: '2026-02-08', hora: '10:00 AM - 11:00 AM' },
          { fecha: '2026-02-09', hora: '02:00 PM - 03:00 PM' },
          { fecha: '2026-02-10', hora: '09:00 AM - 10:00 AM' }
        ],
        alternativaSeleccionada: null,
        respondida: false
      },
      {
        id: 7,
        materia: 'Matemáticas Discretas',
        docente: 'Dr. Luis González',
        docenteEmail: 'luis.gonzalez@universidad.edu.ec',
        fecha: '2026-02-06',
        hora: '11:00 AM - 12:00 PM',
        fechaProcesada: 'Cancelada el 2026-02-03',
        estado: 'Cancelada'
      },
      {
        id: 8,
        materia: 'Programación II',
        docente: 'Ing. María Rodríguez',
        docenteEmail: 'maria.rodriguez@universidad.edu.ec',
        fecha: '2026-02-05',
        hora: '03:00 PM - 04:00 PM',
        fechaProcesada: 'Rechazada el 2026-02-02',
        estado: 'Rechazada',
        alternativasPropuestas: [
          { fecha: '2026-02-07', hora: '02:00 PM - 03:00 PM' },
          { fecha: '2026-02-08', hora: '04:00 PM - 05:00 PM' }
        ],
        alternativaSeleccionada: 0,
        respondida: true
      }
    ];
  }

  cambiarTab(tab: string) {
    this.tabActivo = tab;
    console.log('Tab activo:', tab);
  }

  onFiltroProcesadasChange() {
    console.log('Filtro de procesadas:', this.filtroProcesadas);
    this.aplicarFiltroProcesadas();
  }

  aplicarFiltroProcesadas() {
    if (this.filtroProcesadas === 'todas') {
      this.solicitudesProcesadasFiltradas = [...this.solicitudesProcesadas];
    } else if (this.filtroProcesadas === 'rechazadas') {
      this.solicitudesProcesadasFiltradas = this.solicitudesProcesadas.filter(
        s => s.estado === 'Rechazada'
      );
    } else if (this.filtroProcesadas === 'canceladas') {
      this.solicitudesProcesadasFiltradas = this.solicitudesProcesadas.filter(
        s => s.estado === 'Cancelada'
      );
    }
  }

  cancelarSolicitud(solicitud: Solicitud) {
    console.log('Cancelar solicitud:', solicitud);

    // Aquí se mostraría un modal de confirmación
    // y se enviaría la cancelación al servicio

    // Ejemplo de lo que haría:
    // this.solicitudService.cancelar(solicitud.id).subscribe(() => {
    //   // Mover de pendientes a procesadas
    //   // Actualizar estado
    //   // Mostrar toast de confirmación
    // });
  }

  seleccionarAlternativa(solicitud: Solicitud, index: number) {
    if (solicitud.respondida) {
      return; // No permitir cambiar si ya respondió
    }

    console.log('Seleccionar alternativa:', index, 'para solicitud:', solicitud.id);
    solicitud.alternativaSeleccionada = index;
  }

  aceptarAlternativa(solicitud: Solicitud) {
    if (solicitud.alternativaSeleccionada === null || solicitud.alternativaSeleccionada === undefined) {
      console.log('Debe seleccionar una alternativa');
      return;
    }

    console.log('Aceptar alternativa:', solicitud.alternativaSeleccionada, 'de solicitud:', solicitud.id);

    // Según los requisitos:
    // "El sistema debe permitir al estudiante aceptar una única alternativa propuesta por el docente"
    // "El sistema debe confirmar automáticamente la tutoría cuando ambas partes coincidan en el horario"

    // Aquí se enviaría al servicio:
    // this.solicitudService.aceptarAlternativa(solicitud.id, solicitud.alternativaSeleccionada).subscribe(() => {
    //   solicitud.respondida = true;
    //   // La tutoría se confirma automáticamente
    //   // Se registra en los calendarios de ambos
    //   // Se notifica al estudiante
    //   // Mostrar toast de éxito
    // });

    // Para la demo:
    solicitud.respondida = true;
    console.log('Alternativa aceptada - Tutoría confirmada automáticamente');
  }

  verDetalles(solicitud: Solicitud) {
    console.log('Ver detalles de solicitud:', solicitud);
    // Aquí se abriría un modal con todos los detalles
  }

  onRefresh() {
    console.log('Refrescando solicitudes...');
    // Aquí se recargarían las solicitudes desde el servicio
    // this.solicitudService.obtenerMisSolicitudes().subscribe(...)
  }
}
