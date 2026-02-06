
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';


import { Router } from '@angular/router';
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
  informationCircleOutline,
  personOutline,
  bookOutline,
  calendarOutline,
  timeOutline,
  chatbubbleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  checkmarkDoneOutline,
  filterOutline,
  swapHorizontalOutline,
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
  estudiante: string;
  correo: string;
  materia: string;
  fecha: string;
  hora: string;
  motivo?: string;
  tiempoTranscurrido: string;
  estado: string;
  fechaProcesada?: string;
  alternativasPropuestas?: AlternativaPropuesta[];
}

@Component({
  selector: 'app-profesor-solicitudes',
  templateUrl: './profesor-solicitudes.page.html',
  styleUrls: ['./profesor-solicitudes.page.scss'],
  standalone: true,
 imports: [
    CommonModule,
    FormsModule,
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
export class ProfesorSolicitudesPage implements OnInit {

  tabActivo: string = 'pendientes';
  filtroProcesadas: string = 'todas';

  solicitudesPendientes: Solicitud[] = [];
  solicitudesProcesadas: Solicitud[] = [];
  solicitudesProcesadasFiltradas: Solicitud[] = [];

  constructor(private router: Router) {
    // Registrar los íconos
    addIcons({
      'refresh-outline': refreshOutline,
      'information-circle-outline': informationCircleOutline,
      'person-outline': personOutline,
      'book-outline': bookOutline,
      'calendar-outline': calendarOutline,
      'time-outline': timeOutline,
      'chatbubble-outline': chatbubbleOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'close-circle-outline': closeCircleOutline,
      'checkmark-done-outline': checkmarkDoneOutline,
      'filter-outline': filterOutline,
      'swap-horizontal-outline': swapHorizontalOutline,
      'checkmark-outline': checkmarkOutline,
      'eye-outline': eyeOutline,
      'folder-open-outline': folderOpenOutline
    });
  }

  ngOnInit() {
    console.log('Página de solicitudes inicializada');
    this.cargarDatosEjemplo();
    this.aplicarFiltroProcesadas();
  }

  cargarDatosEjemplo() {
    // Solicitudes pendientes
    this.solicitudesPendientes = [
      {
        id: 1,
        estudiante: 'María González',
        correo: 'maria.gonzalez@universidad.edu.ec',
        materia: 'Cálculo Diferencial',
        fecha: '2026-02-08',
        hora: '10:00 AM - 11:00 AM',
        motivo: 'Necesito ayuda para comprender el tema de límites y derivadas. Tengo examen la próxima semana.',
        tiempoTranscurrido: '2 horas',
        estado: 'Pendiente'
      },
      {
        id: 2,
        estudiante: 'Carlos Ramírez',
        correo: 'carlos.ramirez@universidad.edu.ec',
        materia: 'Álgebra Lineal',
        fecha: '2026-02-09',
        hora: '02:00 PM - 03:00 PM',
        motivo: 'Tengo dudas sobre sistemas de ecuaciones lineales y matrices.',
        tiempoTranscurrido: '5 horas',
        estado: 'Pendiente'
      },
      {
        id: 3,
        estudiante: 'Ana Martínez',
        correo: 'ana.martinez@universidad.edu.ec',
        materia: 'Cálculo Integral',
        fecha: '2026-02-10',
        hora: '09:00 AM - 10:00 AM',
        tiempoTranscurrido: '1 día',
        estado: 'Pendiente'
      },
      {
        id: 4,
        estudiante: 'Pedro Sánchez',
        correo: 'pedro.sanchez@universidad.edu.ec',
        materia: 'Cálculo Diferencial',
        fecha: '2026-02-11',
        hora: '11:00 AM - 12:00 PM',
        motivo: 'Necesito repasar los ejercicios del último capítulo antes del parcial.',
        tiempoTranscurrido: '1 día',
        estado: 'Pendiente'
      },
      {
        id: 5,
        estudiante: 'Laura Torres',
        correo: 'laura.torres@universidad.edu.ec',
        materia: 'Ecuaciones Diferenciales',
        fecha: '2026-02-12',
        hora: '03:00 PM - 04:00 PM',
        motivo: 'Dificultades con ecuaciones de primer orden y variables separables.',
        tiempoTranscurrido: '2 días',
        estado: 'Pendiente'
      }
    ];

    // Solicitudes procesadas
    this.solicitudesProcesadas = [
      {
        id: 6,
        estudiante: 'Diego Morales',
        correo: 'diego.morales@universidad.edu.ec',
        materia: 'Álgebra Lineal',
        fecha: '2026-02-06',
        hora: '10:00 AM - 11:30 AM',
        tiempoTranscurrido: '1 día',
        estado: 'Aceptada',
        fechaProcesada: '2026-02-04'
      },
      {
        id: 7,
        estudiante: 'Sofía Vargas',
        correo: 'sofia.vargas@universidad.edu.ec',
        materia: 'Cálculo Diferencial',
        fecha: '2026-02-07',
        hora: '04:00 PM - 05:00 PM',
        tiempoTranscurrido: '2 días',
        estado: 'Rechazada',
        fechaProcesada: '2026-02-03',
        alternativasPropuestas: [
          { fecha: '2026-02-08', hora: '10:00 AM - 11:00 AM' },
          { fecha: '2026-02-09', hora: '02:00 PM - 03:00 PM' }
        ]
      },
      {
        id: 8,
        estudiante: 'Roberto Díaz',
        correo: 'roberto.diaz@universidad.edu.ec',
        materia: 'Matemáticas Discretas',
        fecha: '2026-02-05',
        hora: '09:00 AM - 10:00 AM',
        tiempoTranscurrido: '3 días',
        estado: 'Aceptada',
        fechaProcesada: '2026-02-02'
      },
      {
        id: 9,
        estudiante: 'Valentina Cruz',
        correo: 'valentina.cruz@universidad.edu.ec',
        materia: 'Cálculo Integral',
        fecha: '2026-02-06',
        hora: '02:00 PM - 03:00 PM',
        tiempoTranscurrido: '2 días',
        estado: 'Aceptada',
        fechaProcesada: '2026-02-03'
      },
      {
        id: 10,
        estudiante: 'Andrés Ruiz',
        correo: 'andres.ruiz@universidad.edu.ec',
        materia: 'Álgebra Lineal',
        fecha: '2026-02-08',
        hora: '11:00 AM - 12:00 PM',
        tiempoTranscurrido: '1 día',
        estado: 'Rechazada',
        fechaProcesada: '2026-02-04',
        alternativasPropuestas: [
          { fecha: '2026-02-10', hora: '09:00 AM - 10:00 AM' },
          { fecha: '2026-02-11', hora: '03:00 PM - 04:00 PM' },
          { fecha: '2026-02-12', hora: '10:00 AM - 11:00 AM' }
        ]
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
    } else if (this.filtroProcesadas === 'aceptadas') {
      this.solicitudesProcesadasFiltradas = this.solicitudesProcesadas.filter(
        s => s.estado === 'Aceptada'
      );
    } else if (this.filtroProcesadas === 'rechazadas') {
      this.solicitudesProcesadasFiltradas = this.solicitudesProcesadas.filter(
        s => s.estado === 'Rechazada'
      );
    }
  }

  aceptarSolicitud(solicitud: Solicitud) {
    console.log('Aceptar solicitud:', solicitud);

    // Aquí se mostraría un modal de confirmación
    // y se enviaría la aceptación al servicio

    // Ejemplo de lo que haría:
    // this.solicitudService.aceptar(solicitud.id).subscribe(() => {
    //   // Mover de pendientes a procesadas
    //   // Actualizar estado
    //   // Mostrar toast de éxito
    //   // Enviar notificación al estudiante
    // });
  }

  rechazarSolicitud(solicitud: Solicitud) {
    console.log('Rechazar solicitud:', solicitud);

    // Aquí se abriría un modal para que el profesor
    // ingrese las alternativas de fecha/hora

    // Según los requisitos, debe proponer al menos una alternativa
    // y el sistema debe validar que estén disponibles

    // Ejemplo:
    // const modal = await this.modalController.create({
    //   component: ModalAlternativasComponent,
    //   componentProps: { solicitud }
    // });
    // await modal.present();
  }

  verDetallesSolicitud(solicitud: Solicitud) {
    console.log('Ver detalles de solicitud:', solicitud);
    // Aquí se abriría un modal con todos los detalles
  }

  onRefresh() {
    console.log('Refrescando solicitudes...');
    // Aquí se recargarían las solicitudes desde el servicio
    // this.solicitudService.obtenerSolicitudes().subscribe(...)
  }
}
