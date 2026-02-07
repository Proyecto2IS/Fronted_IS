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
import { TutoriasService } from '../../Services/tutoria.service';

interface AlternativaPropuesta {
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
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

  constructor(private router: Router,
    private tutoriaService: TutoriasService,
  ) {
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
  this.cargarSolicitudes();
}
cargarSolicitudes() {

  this.tutoriaService.obtenerTutoriasEstudiante()
    .subscribe((resp: any[]) => {

      const solicitudesMapeadas: Solicitud[] = resp.map((t: any) => ({
        id: t.id,
        materia: t.tema || 'Sin materia',
        docente: 'Docente ' + t.docente_id,   // temporal (igual que profe)
        docenteEmail: '',
        fecha: t.fecha,
        hora: t.hora_inicio + ' - ' + t.hora_fin,
        estado: this.mapearEstado(t.estado),
        alternativasPropuestas:
  t.propuestas?.length
    ? t.propuestas[0].alternativas.map((alt: any) => ({
        fecha: alt.fecha,
        hora_inicio: alt.hora_inicio,
        hora_fin: alt.hora_fin
      }))
    : [],

        alternativaSeleccionada: null,
        respondida: false
      }));
console.log('🟢 RESPUESTA ESTUDIANTE:', resp);

      // 🔹 pendientes
      this.solicitudesPendientes =
        solicitudesMapeadas.filter(s => s.estado === 'Pendiente');

      // 🔹 confirmadas
      this.solicitudesConfirmadas =
        solicitudesMapeadas.filter(s => s.estado === 'Confirmada');

      // 🔹 rechazadas / canceladas
      this.solicitudesProcesadas =
        solicitudesMapeadas.filter(
          s => s.estado === 'Rechazada' || s.estado === 'Cancelada'
        );

      this.aplicarFiltroProcesadas();
      resp.forEach(t => {
  console.log('🟥 PROPUESTAS RAW:', t.propuestas);
});

    });

}
mapearEstado(estado: string): string {
  switch (estado) {
    case 'pendiente': return 'Pendiente';
    case 'confirmada': return 'Confirmada';
    case 'rechazada': return 'Rechazada';
    case 'cancelada': return 'Cancelada';
    default: return estado;
  }
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


  seleccionarAlternativa(solicitud: Solicitud, index: number) {
    if (solicitud.respondida) {
      return; // No permitir cambiar si ya respondió
    }

    console.log('Seleccionar alternativa:', index, 'para solicitud:', solicitud.id);
    solicitud.alternativaSeleccionada = index;
  }

  aceptarAlternativa(solicitud: Solicitud) {
  if (solicitud.alternativaSeleccionada === null) {
    console.log('Debe seleccionar una alternativa');
    return;
  }

  this.tutoriaService.aceptarPropuesta(solicitud.id).subscribe({
    next: () => {
      // 🔹 Actualizar frontend
      solicitud.respondida = true;
      solicitud.estado = 'Confirmada';

      // 🔹 Mover entre listas
      this.solicitudesPendientes =
        this.solicitudesPendientes.filter(s => s.id !== solicitud.id);

      this.solicitudesConfirmadas.push(solicitud);

      this.solicitudesProcesadas.push(solicitud);
      this.aplicarFiltroProcesadas();

      console.log('✅ Propuesta aceptada y tutoría confirmada');
    },
    error: (err) => {
      console.error('❌ Error al aceptar propuesta', err);
    }
  });
}


  verDetalles(solicitud: Solicitud) {
    console.log('Ver detalles de solicitud:', solicitud);
    // Aquí se abriría un modal con todos los detalles
  }

onRefresh() {
  this.cargarSolicitudes();
}
}
