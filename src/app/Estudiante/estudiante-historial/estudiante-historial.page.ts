
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TutoriasService } from 'src/app/Services/tutoria.service';
import { Router, RouterModule } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  downloadOutline,
  calendarOutline,
  checkmarkDoneOutline,
  closeCircleOutline,
  bookOutline,
  filterOutline,
  personOutline,
  timeOutline,
  hourglassOutline,
  checkmarkCircle,
  closeCircle,
  informationCircleOutline,
  documentTextOutline,
  eyeOutline,
  calendarClearOutline,
  addCircleOutline
} from 'ionicons/icons';

interface SemanaActual {
  inicio: string;
  fin: string;
}

interface Tutoria {
  id: number;
  materia: string;
  docente: string;
  docenteEmail: string;
  fecha: string;
  hora: string;
  duracion: number;
  estado: string;
  numeroAsistieron: number;
  asistio: number;
  motivoCancelacion?: string;
  notas?: string;
  fechaCompleta: Date;
}

@Component({
  selector: 'app-estudiante-historial',
  templateUrl: './estudiante-historial.page.html',
  styleUrls: ['./estudiante-historial.page.scss'],
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
export class EstudianteHistorialPage implements OnInit {
semanaActual: SemanaActual = {
    inicio: '31 Ene',
    fin: '06 Feb'
  };
  asistenciasSemana: number = 3;
  perdidasSemana: number = 1;
  totalSemana: number = 4;

  // Estadísticas generales
  totalCompletadas: number = 0;
  totalCanceladas: number = 0;
  totalMaterias: number = 0;

  // Filtros
  filtroPeriodo: string = 'mes';
  filtroEstado: string = 'todos';
  filtroMateria: string = 'todas';

  // Datos
  materias: string[] = [];
  todasLasTutorias: Tutoria[] = [];
  tutoriasFiltradas: Tutoria[] = [];

  constructor(private router: Router,
     private tutoriasService: TutoriasService
  ) {
    // Registrar los íconos
    addIcons({
      'download-outline': downloadOutline,
      'calendar-outline': calendarOutline,
      'checkmark-done-outline': checkmarkDoneOutline,
      'close-circle-outline': closeCircleOutline,
      'book-outline': bookOutline,
      'filter-outline': filterOutline,
      'person-outline': personOutline,
      'time-outline': timeOutline,
      'hourglass-outline': hourglassOutline,
      'checkmark-circle': checkmarkCircle,
      'close-circle': closeCircle,
      'information-circle-outline': informationCircleOutline,
      'document-text-outline': documentTextOutline,
      'eye-outline': eyeOutline,
      'calendar-clear-outline': calendarClearOutline,
      'add-circle-outline': addCircleOutline
    });
  }

ngOnInit() {
  this.cargarHistorial();
}
cargarHistorial() {

  this.tutoriasService.obtenerHistorial()
    .subscribe({

      next: (data: any[]) => {

        this.todasLasTutorias = data.map((t: any) => ({

  id: t.id,
  materia: t.materia_nombre,
  docente: t.docente_nombre,
  docenteEmail: t.docente_email,
  fecha: t.fecha,
  hora: `${t.hora_inicio} - ${t.hora_fin}`,
  duracion: t.duracion,
  estado: this.formatearEstado(t.estado),
  motivoCancelacion: t.motivo_cancelacion,
  fechaCompleta: new Date(t.fecha),
  numeroAsistieron: t.numero_estudiantes_asistieron,
  asistio: t.numero_estudiantes_asistieron || 0

}));

        this.materias = [...new Set(this.todasLasTutorias.map(t => t.materia))];

        this.aplicarFiltros();
        this.calcularEstadisticas();
        this.calcularSemanaActual();

      },

      error: (err) => {
        console.error('Error cargando historial', err);
      }

    });
}
formatearEstado(estado: string): string {

  const mapa: any = {
    'finalizada': 'Completada',
    'cancelada': 'Cancelada',
    'confirmada': 'Completada'
  };

  return mapa[estado?.toLowerCase()] || estado;
}
  aplicarFiltros() {
    let resultado = [...this.todasLasTutorias];

    // Filtro por período
    const hoy = new Date();
    switch (this.filtroPeriodo) {
      case 'semana':
        const inicioDeSemana = new Date(hoy);
        inicioDeSemana.setDate(hoy.getDate() - 7);
        resultado = resultado.filter(t => t.fechaCompleta >= inicioDeSemana);
        break;
      case 'mes':
        const inicioDeMes = new Date(hoy);
        inicioDeMes.setDate(hoy.getDate() - 30);
        resultado = resultado.filter(t => t.fechaCompleta >= inicioDeMes);
        break;
      case 'trimestre':
        const inicioDeTrimestre = new Date(hoy);
        inicioDeTrimestre.setDate(hoy.getDate() - 90);
        resultado = resultado.filter(t => t.fechaCompleta >= inicioDeTrimestre);
        break;
      case 'semestre':
        const inicioDeSemestre = new Date(hoy);
        inicioDeSemestre.setDate(hoy.getDate() - 180);
        resultado = resultado.filter(t => t.fechaCompleta >= inicioDeSemestre);
        break;
    }

    // Filtro por estado
    if (this.filtroEstado !== 'todos') {
      resultado = resultado.filter(t => t.estado.toLowerCase() === this.filtroEstado);
    }

    // Filtro por materia
    if (this.filtroMateria !== 'todas') {
      resultado = resultado.filter(t => t.materia === this.filtroMateria);
    }

    // Ordenar por fecha descendente
    resultado.sort((a, b) => b.fechaCompleta.getTime() - a.fechaCompleta.getTime());

    this.tutoriasFiltradas = resultado;
  }

  calcularEstadisticas() {
    this.totalCompletadas = this.tutoriasFiltradas.filter(t => t.estado === 'Completada').length;
    this.totalCanceladas = this.tutoriasFiltradas.filter(t => t.estado === 'Cancelada').length;

    const materiasUnicas = new Set(this.tutoriasFiltradas.map(t => t.materia));
    this.totalMaterias = materiasUnicas.size;
  }

calcularSemanaActual() {

  const hoy = new Date();
  const inicioDeSemana = new Date(hoy);
  inicioDeSemana.setDate(hoy.getDate() - 7);

  const tutoriasSemana = this.todasLasTutorias.filter(
    t => t.fechaCompleta >= inicioDeSemana && t.estado === 'Completada'
  );

  this.totalSemana = tutoriasSemana.length;

  this.asistenciasSemana = tutoriasSemana
    .filter(t => t.numeroAsistieron > 0).length;

  this.perdidasSemana = tutoriasSemana
    .filter(t => t.numeroAsistieron === 0).length;
}

  onFiltroChange() {
    console.log('Filtros actualizados:', {
      periodo: this.filtroPeriodo,
      estado: this.filtroEstado,
      materia: this.filtroMateria
    });
    this.aplicarFiltros();
    this.calcularEstadisticas();
  }

  getTutoriaColor(estado: string): string {
    const colores: { [key: string]: string } = {
      'Completada': 'success',
      'Cancelada': 'danger'
    };
    return colores[estado] || 'medium';
  }

  verDetalles(tutoria: Tutoria) {
    console.log('Ver detalles de tutoría:', tutoria);
    // Aquí se abriría un modal con todos los detalles
  }

  onDescargarReporte() {
    this.exportarPDF();
  }

  onGenerarReporteSemanal() {
    this.exportarExcel();
  }

  exportarPDF() {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Reporte de Mis Tutorías', 14, 15);

    const filas = this.tutoriasFiltradas.map(t => [
      t.materia,
      t.docente,
      t.fecha,
      t.hora,
      t.estado,
      t.asistio.toString()
    ]);

    autoTable(doc, {
      startY: 25,
      head: [['Materia', 'Docente', 'Fecha', 'Hora', 'Estado', 'Asistencia']],
      body: filas
    });

    doc.save('reporte_tutorías_estudiante.pdf');
  }

  exportarExcel() {
    console.log('Exportando a Excel...');
    // Implementar exportación a Excel (requiere librería adicional como xlsx)
  }
}
