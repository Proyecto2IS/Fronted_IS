import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel } from '@ionic/angular/standalone';
import { TutoriasService } from '../../Services/tutoria.service';
import { IonInput } from '@ionic/angular/standalone';
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
 imports: [IonLabel,
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
    IonSelectOption,
    IonInput
  ]
})
export class ProfesorSolicitudesPage implements OnInit {

  tabActivo: string = 'pendientes';
  filtroProcesadas: string = 'todas';
  solicitudes:any[] = [];
   solicitudCancelando:any = null;

motivo = '';
fecha = '';
horaInicio = '';
horaFin = '';
materiasMap = new Map<number, string>();
estudiantesMap = new Map<number, string>();

  solicitudesPendientes: Solicitud[] = [];
  solicitudesProcesadas: Solicitud[] = [];
  solicitudesProcesadasFiltradas: Solicitud[] = [];

  constructor(private router: Router, private tutoriaService: TutoriasService) {

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
    this.cargarCatalogos();
  }
cargarCatalogos() {
  Promise.all([
    this.tutoriaService.getMaterias().toPromise(),
    this.tutoriaService.getEstudiantes().toPromise()
  ]).then(([materias, estudiantes]) => {

    if (materias) {
      materias.forEach((m:any) =>
        this.materiasMap.set(m.id, m.nombre)
      );
    }

    if (estudiantes) {
      estudiantes.forEach((e:any) =>
        this.estudiantesMap.set(e.id, e.nombre)
      );
    }

    // 👇 ahora sí cargas solicitudes
    this.cargarSolicitudes();
  });
}

  cambiarTab(tab: string) {
    this.tabActivo = tab;

  }
  cargarSolicitudes(){

  this.tutoriaService.getTutoriasDocente()
  .subscribe((resp: any) => {

    const solicitudesMapeadas = resp.map((t:any)=>({
  id: t.id,
  estudiante: this.estudiantesMap.get(t.estudiante_id) || 'Estudiante no encontrado',
  correo: '',
  materia: this.materiasMap.get(t.materia_id) || 'Materia no encontrada',
  fecha: t.fecha,
  hora: `${t.hora_inicio} - ${t.hora_fin}`,
  motivo: t.tema,
  tiempoTranscurrido: '',
  estado: t.estado
}));

    this.solicitudesPendientes =
      solicitudesMapeadas.filter((t:any)=> t.estado === 'pendiente');

    this.solicitudesProcesadas =
      solicitudesMapeadas.filter((t:any)=> t.estado !== 'pendiente');

    this.solicitudesProcesadasFiltradas =
      this.solicitudesProcesadas;

  });

}


  onFiltroProcesadasChange() {
     if(this.filtroProcesadas === 'todas'){
    this.solicitudesProcesadasFiltradas =
      this.solicitudesProcesadas;
  }

  if(this.filtroProcesadas === 'aceptadas'){
    this.solicitudesProcesadasFiltradas =
      this.solicitudesProcesadas.filter((s:any)=> s.estado === 'aceptada');
  }

  if(this.filtroProcesadas === 'rechazadas'){
    this.solicitudesProcesadasFiltradas =
      this.solicitudesProcesadas.filter((s:any)=> s.estado === 'rechazada');
  }
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

 aceptarSolicitud(solicitud: any) {
  this.tutoriaService
    .actualizarEstadoTutoria(solicitud.id, 'confirmada') // 👈 CLAVE
    .subscribe({
      next: () => {
        this.cargarSolicitudes();
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.error || 'No se pudo confirmar la tutoría');
      }
    });
}



rechazarSolicitud(solicitud:any){
  this.solicitudCancelando = solicitud;
}

confirmarCancelacion() {

  if (!this.motivo || this.motivo.trim() === '') {
    alert('Debe ingresar el motivo');
    return;
  }

  if (!this.fecha || !this.horaInicio || !this.horaFin) {
    alert('Debe ingresar una propuesta de fecha y horario');
    return;
  }

  const propuestas = [
    {
      fecha: this.fecha,
      hora_inicio: this.horaInicio + ':00',
      hora_fin: this.horaFin + ':00'
    }
  ];

  this.tutoriaService.cancelarTutoria(
    this.solicitudCancelando.id,
    this.motivo,
    propuestas
  ).subscribe({
    next: () => {
      this.solicitudCancelando = null;
      this.motivo = '';
      this.fecha = '';
      this.horaInicio = '';
      this.horaFin = '';
      this.cargarSolicitudes();
    },
    error: (err) => {
      console.error(err);
      alert(err.error?.error || 'Error al cancelar la tutoría');
    }
  });
}


  verDetallesSolicitud(solicitud: Solicitud) {
    console.log('Ver detalles de solicitud:', solicitud);
    // Aquí se abriría un modal con todos los detalles
  }

  onRefresh() {
    this.cargarSolicitudes();
    // Aquí se recargarían las solicitudes desde el servicio
    // this.solicitudService.obtenerSolicitudes().subscribe(...)
  }
}
