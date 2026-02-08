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
  id: number;
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
  estado: string;

  numeroEstudiantesSolicitados?: number;
  numeroEstudiantesAsistieron?: number;

  alternativasPropuestas?: AlternativaPropuesta[];
  alternativaSeleccionada?: number | null;
  respondida?: boolean;

  tiempoTranscurrido?: string;
  fechaConfirmacion?: string;
  fechaProcesada?: string;
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

  constructor(
    private router: Router,
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
      .subscribe({
        next: (resp: any[]) => {
          console.log('🟢 RESPUESTA COMPLETA DEL BACKEND:', resp);

          const solicitudesMapeadas: Solicitud[] = resp.map((t: any) => {

            // 🔹 Extraer alternativas propuestas
            let alternativas: AlternativaPropuesta[] = [];

            if (t.propuestas && Array.isArray(t.propuestas) && t.propuestas.length > 0) {
              console.log('🟡 Propuestas encontradas para tutoría', t.id, ':', t.propuestas);

              // Iterar sobre todas las propuestas (aunque normalmente debería haber solo una)
              t.propuestas.forEach((propuesta: any) => {
                if (propuesta.alternativas && Array.isArray(propuesta.alternativas)) {
                  const altsTemp = propuesta.alternativas.map((alt: any) => ({
                    id: alt.id,
                    fecha: alt.fecha,
                    hora_inicio: alt.hora_inicio,
                    hora_fin: alt.hora_fin
                  }));
                  alternativas.push(...altsTemp);
                }
              });
            }

            console.log('🔵 Alternativas mapeadas para tutoría', t.id, ':', alternativas);

            return {
              id: t.id,
              materia: t.tema || 'Sin materia',
              docente: 'Docente ' + t.docente_id,
              docenteEmail: '',
              fecha: t.fecha,
              hora: t.hora_inicio + ' - ' + t.hora_fin,
              estado: this.mapearEstado(t.estado),

              numeroEstudiantesSolicitados: t.numero_estudiantes_solicitados,
              numeroEstudiantesAsistieron: t.numero_estudiantes_asistieron,

              tiempoTranscurrido: t.tiempo_transcurrido || 'hace un momento',
              fechaConfirmacion: t.fecha_confirmacion,
              fechaProcesada: t.updatedAt,

              alternativasPropuestas: alternativas,
              alternativaSeleccionada: null,
              respondida: false
            };
          });

          console.log('🟢 SOLICITUDES MAPEADAS:', solicitudesMapeadas);

          // 🔹 Filtrar por estado
          this.solicitudesPendientes =
            solicitudesMapeadas.filter(s => s.estado === 'Pendiente');

          this.solicitudesConfirmadas =
            solicitudesMapeadas.filter(s => s.estado === 'Confirmada');

          this.solicitudesProcesadas =
            solicitudesMapeadas.filter(
              s => s.estado === 'Rechazada' || s.estado === 'Cancelada'
            );

          console.log('📋 Pendientes:', this.solicitudesPendientes);
          console.log('✅ Confirmadas:', this.solicitudesConfirmadas);
          console.log('🗂️ Procesadas:', this.solicitudesProcesadas);

          this.aplicarFiltroProcesadas();
        },
        error: (err) => {
          console.error('❌ Error al cargar solicitudes:', err);
        }
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

    console.log('✅ Seleccionar alternativa:', index, 'para solicitud:', solicitud.id);
    solicitud.alternativaSeleccionada = index;
  }

  aceptarAlternativa(solicitud: Solicitud) {
    if (solicitud.alternativaSeleccionada == null) {
      console.warn('⚠️ No hay alternativa seleccionada');
      return;
    }

    const idx = solicitud.alternativaSeleccionada as number;
    const alternativa = solicitud.alternativasPropuestas && solicitud.alternativasPropuestas[idx];

    if (!alternativa) {
      console.error('❌ Alternativa no encontrada para la solicitud', solicitud.id);
      return;
    }

    console.log('📤 Enviando aceptación de alternativa con ID:', alternativa.id);

    this.tutoriaService.aceptarPropuesta(alternativa.id).subscribe({
      next: (response) => {
        console.log('✅ Alternativa aceptada con éxito:', response);

        solicitud.respondida = true;
        solicitud.estado = 'Confirmada';

        // Remover de pendientes y procesadas
        this.solicitudesPendientes =
          this.solicitudesPendientes.filter(s => s.id !== solicitud.id);

        this.solicitudesProcesadas =
          this.solicitudesProcesadas.filter(s => s.id !== solicitud.id);

        // Agregar a confirmadas
        this.solicitudesConfirmadas.push(solicitud);

        this.aplicarFiltroProcesadas();
      },
      error: (err) => {
        console.error('❌ Error al aceptar alternativa:', err);
        alert('Error al aceptar la alternativa. Por favor, intenta de nuevo.');
      }
    });
  }

  verDetalles(solicitud: Solicitud) {
    console.log('👁️ Ver detalles de solicitud:', solicitud);
    // Aquí se abriría un modal con todos los detalles
  }

  onRefresh() {
    console.log('🔄 Refrescando solicitudes...');
    this.cargarSolicitudes();
  }
}
