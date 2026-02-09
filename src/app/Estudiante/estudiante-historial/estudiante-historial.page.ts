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

  estadoOriginal: string;   // 👈 REAL DEL BACKEND
  estado: string;           // 👈 FORMATEADO PARA UI

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
    inicio: '',
    fin: ''
  };

  asistenciasSemana = 0;
  perdidasSemana = 0;
  totalSemana = 0;

  totalCompletadas = 0;
  totalCanceladas = 0;
  totalMaterias = 0;

  filtroPeriodo = 'mes';
  filtroEstado = 'todos';     // 👈 ahora usa valores backend
  filtroMateria = 'todas';

  materias: string[] = [];
  todasLasTutorias: Tutoria[] = [];
  tutoriasFiltradas: Tutoria[] = [];

  constructor(
    private router: Router,
    private tutoriasService: TutoriasService
  ) {
    addIcons({
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
    });
  }

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.tutoriasService.obtenerHistorial()
      .subscribe({

        next: (data: any[]) => {
          console.log('📚 Datos del historial recibidos:', data);

          this.todasLasTutorias = data.map((t: any) => ({

            id: t.id,
            materia: t.materia_nombre,
            docente: t.docente_nombre,
            docenteEmail: t.docente_email,
            fecha: t.fecha,
            hora: `${t.hora_inicio} - ${t.hora_fin}`,
            duracion: t.duracion,

            estadoOriginal: t.estado,                 // 👈 REAL
            estado: this.formatearEstado(t.estado),   // 👈 VISUAL

            motivoCancelacion: t.motivo_cancelacion,
            notas: t.notas,
            fechaCompleta: new Date(t.fecha),
            numeroAsistieron: t.numero_estudiantes_asistieron ?? 0,
            asistio: t.numero_estudiantes_asistieron ?? 0

          }));

          console.log('✅ Tutorías mapeadas:', this.todasLasTutorias);

          this.materias = [...new Set(this.todasLasTutorias.map(t => t.materia))];

          this.aplicarFiltros();
          this.calcularEstadisticas();
          this.calcularSemanaActual();

          console.log('📊 Tutorías filtradas:', this.tutoriasFiltradas);
        },

        error: (err) => {
          console.error('❌ Error cargando historial', err);
        }
      });
  }

  formatearEstado(estado: string): string {
    const mapa: any = {
      'pendiente': 'Pendiente',
      'confirmada': 'Completada',
      'finalizada': 'Completada',
      'rechazada': 'Rechazada',
      'cancelada': 'Cancelada'
    };
    return mapa[estado?.toLowerCase()] || estado;
  }

  aplicarFiltros() {

    let resultado = [...this.todasLasTutorias];
    const hoy = new Date();

    // 🔹 PERIODO
    if (this.filtroPeriodo !== 'todos') {

      let dias = 0;

      if (this.filtroPeriodo === 'semana') dias = 7;
      if (this.filtroPeriodo === 'mes') dias = 30;
      if (this.filtroPeriodo === 'trimestre') dias = 90;
      if (this.filtroPeriodo === 'semestre') dias = 180;

      const inicio = new Date(hoy);
      inicio.setDate(hoy.getDate() - dias);

      resultado = resultado.filter(t => t.fechaCompleta >= inicio);
    }

    // 🔹 ESTADO (USA ESTADO REAL)
    if (this.filtroEstado !== 'todos') {
      if (this.filtroEstado === 'completadas') {
        // Mostrar tanto finalizadas como confirmadas
        resultado = resultado.filter(
          t => t.estadoOriginal === 'finalizada' || t.estadoOriginal === 'confirmada'
        );
      } else {
        resultado = resultado.filter(
          t => t.estadoOriginal === this.filtroEstado
        );
      }
    }

    // 🔹 MATERIA
    if (this.filtroMateria !== 'todas') {
      resultado = resultado.filter(
        t => t.materia === this.filtroMateria
      );
    }

    resultado.sort((a, b) =>
      b.fechaCompleta.getTime() - a.fechaCompleta.getTime()
    );

    this.tutoriasFiltradas = resultado;
  }

  calcularEstadisticas() {

    this.totalCompletadas =
      this.tutoriasFiltradas.filter(
        t => t.estadoOriginal === 'finalizada' || t.estadoOriginal === 'confirmada'
      ).length;

    this.totalCanceladas =
      this.tutoriasFiltradas.filter(
        t => t.estadoOriginal === 'cancelada'
      ).length;

    const materiasUnicas =
      new Set(this.tutoriasFiltradas.map(t => t.materia));

    this.totalMaterias = materiasUnicas.size;
  }

  calcularSemanaActual() {

    const hoy = new Date();
    const inicio = new Date(hoy);
    inicio.setDate(hoy.getDate() - 7);

    const tutoriasSemana =
      this.todasLasTutorias.filter(
        t => t.fechaCompleta >= inicio &&
             (t.estadoOriginal === 'finalizada' || t.estadoOriginal === 'confirmada')
      );

    this.totalSemana = tutoriasSemana.length;

    this.asistenciasSemana =
      tutoriasSemana.filter(t => t.numeroAsistieron > 0).length;

    this.perdidasSemana =
      tutoriasSemana.filter(t => t.numeroAsistieron === 0).length;
  }

  onFiltroChange() {
    this.aplicarFiltros();
    this.calcularEstadisticas();
  }

  getTutoriaColor(estado: string): string {
    if (estado === 'Completada') return 'success';
    if (estado === 'Cancelada') return 'danger';
    return 'medium';
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

    doc.save('reporte_tutorias_estudiante.pdf');
  }

  onDescargarReporte() {
    this.exportarPDF();
  }

  onGenerarReporteSemanal() {
    console.log('Generar reporte semanal');
    // TODO: Implementar reporte semanal
  }

  verDetalles(tutoria: Tutoria) {
    console.log('Ver detalles de tutoría:', tutoria);
    // TODO: Navegar a detalle o abrir modal
  }

}
