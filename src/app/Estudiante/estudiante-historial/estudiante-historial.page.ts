
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
  asistio?: boolean;
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

  constructor(private router: Router) {
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
    console.log('Página de historial del estudiante inicializada');
    this.cargarDatosEjemplo();
    this.aplicarFiltros();
    this.calcularEstadisticas();
    this.calcularSemanaActual();
  }

  cargarDatosEjemplo() {
    // Datos de ejemplo para visualización
    this.todasLasTutorias = [
      {
        id: 1,
        materia: 'Cálculo Diferencial',
        docente: 'Dr. Juan Pérez',
        docenteEmail: 'juan.perez@universidad.edu.ec',
        fecha: '2026-02-03',
        hora: '10:00 AM - 11:00 AM',
        duracion: 60,
        estado: 'Completada',
        asistio: true,
        notas: 'Se revisaron ejercicios de límites y derivadas. Excelente participación.',
        fechaCompleta: new Date('2026-02-03T10:00:00')
      },
      {
        id: 2,
        materia: 'Programación I',
        docente: 'Ing. María Rodríguez',
        docenteEmail: 'maria.rodriguez@universidad.edu.ec',
        fecha: '2026-02-04',
        hora: '02:00 PM - 03:00 PM',
        duracion: 60,
        estado: 'Completada',
        asistio: true,
        notas: 'Práctica de bucles y condicionales en Python.',
        fechaCompleta: new Date('2026-02-04T14:00:00')
      },
      {
        id: 3,
        materia: 'Física I',
        docente: 'Dr. Carlos Mendoza',
        docenteEmail: 'carlos.mendoza@universidad.edu.ec',
        fecha: '2026-02-05',
        hora: '09:00 AM - 10:00 AM',
        duracion: 60,
        estado: 'Completada',
        asistio: false,
        fechaCompleta: new Date('2026-02-05T09:00:00')
      },
      {
        id: 4,
        materia: 'Cálculo Diferencial',
        docente: 'Dr. Juan Pérez',
        docenteEmail: 'juan.perez@universidad.edu.ec',
        fecha: '2026-02-06',
        hora: '11:00 AM - 12:00 PM',
        duracion: 60,
        estado: 'Completada',
        asistio: true,
        fechaCompleta: new Date('2026-02-06T11:00:00')
      },
      {
        id: 5,
        materia: 'Álgebra Lineal',
        docente: 'Dra. Ana Torres',
        docenteEmail: 'ana.torres@universidad.edu.ec',
        fecha: '2026-01-28',
        hora: '03:00 PM - 04:00 PM',
        duracion: 60,
        estado: 'Cancelada',
        motivoCancelacion: 'La profesora tuvo una reunión académica de último minuto y tuvo que cancelar.',
        fechaCompleta: new Date('2026-01-28T15:00:00')
      },
      {
        id: 6,
        materia: 'Programación I',
        docente: 'Ing. María Rodríguez',
        docenteEmail: 'maria.rodriguez@universidad.edu.ec',
        fecha: '2026-01-25',
        hora: '10:00 AM - 11:30 AM',
        duracion: 90,
        estado: 'Completada',
        asistio: true,
        notas: 'Repaso de estructuras de datos: listas, tuplas y diccionarios.',
        fechaCompleta: new Date('2026-01-25T10:00:00')
      },
      {
        id: 7,
        materia: 'Estadística',
        docente: 'Lic. Roberto Vega',
        docenteEmail: 'roberto.vega@universidad.edu.ec',
        fecha: '2026-01-22',
        hora: '04:00 PM - 05:00 PM',
        duracion: 60,
        estado: 'Completada',
        asistio: true,
        fechaCompleta: new Date('2026-01-22T16:00:00')
      },
      {
        id: 8,
        materia: 'Cálculo Diferencial',
        docente: 'Dr. Juan Pérez',
        docenteEmail: 'juan.perez@universidad.edu.ec',
        fecha: '2026-01-20',
        hora: '09:00 AM - 10:00 AM',
        duracion: 60,
        estado: 'Completada',
        asistio: true,
        fechaCompleta: new Date('2026-01-20T09:00:00')
      },
      {
        id: 9,
        materia: 'Física I',
        docente: 'Dr. Carlos Mendoza',
        docenteEmail: 'carlos.mendoza@universidad.edu.ec',
        fecha: '2026-01-18',
        hora: '02:00 PM - 03:00 PM',
        duracion: 60,
        estado: 'Cancelada',
        motivoCancelacion: 'Tuve un imprevisto familiar y no pude asistir.',
        fechaCompleta: new Date('2026-01-18T14:00:00')
      },
      {
        id: 10,
        materia: 'Álgebra Lineal',
        docente: 'Dra. Ana Torres',
        docenteEmail: 'ana.torres@universidad.edu.ec',
        fecha: '2026-01-15',
        hora: '11:00 AM - 12:00 PM',
        duracion: 60,
        estado: 'Completada',
        asistio: true,
        notas: 'Introducción a matrices y determinantes.',
        fechaCompleta: new Date('2026-01-15T11:00:00')
      }
    ];

    // Extraer materias únicas
    this.materias = [...new Set(this.todasLasTutorias.map(t => t.materia))];
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
    // Calcular asistencias de la semana actual
    const hoy = new Date();
    const inicioDeSemana = new Date(hoy);
    inicioDeSemana.setDate(hoy.getDate() - 7);

    const tutoriasSemana = this.todasLasTutorias.filter(
      t => t.fechaCompleta >= inicioDeSemana && t.estado === 'Completada'
    );

    this.asistenciasSemana = tutoriasSemana.filter(t => t.asistio).length;
    this.perdidasSemana = tutoriasSemana.filter(t => !t.asistio).length;
    this.totalSemana = tutoriasSemana.length;
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
    console.log('Descargar reporte general');
    // Aquí se generaría el reporte completo
  }

  onGenerarReporteSemanal() {
    console.log('Generar reporte semanal de asistencia');
    // Aquí se generaría el reporte semanal según el requisito
    // "El sistema debe crear un reporte con el historial semanal de las tutorías de asistencia del estudiante"
  }
}
