
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
  downloadOutline,
  checkmarkDoneOutline,
  closeCircleOutline,
  timeOutline,
  filterOutline,
  personOutline,
  calendarOutline,
  hourglassOutline,
  informationCircleOutline,
  eyeOutline,
  folderOpenOutline,
  documentTextOutline,
  documentOutline,
  gridOutline
} from 'ionicons/icons';

interface Materia {
  id: number;
  nombre: string;
}

interface Tutoria {
  id: number;
  materia: string;
  estudiante: string;
  fecha: string;
  hora: string;
  duracion: number;
  estado: string;
  motivoCancelacion?: string;
  fechaCompleta: Date;
}

@Component({
  selector: 'app-profesor-historial',
  templateUrl: './profesor-historial.page.html',
  styleUrls: ['./profesor-historial.page.scss'],
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
export class ProfesorHistorialPage implements OnInit {

  // Estadísticas
  totalCompletadas: number = 0;
  totalCanceladas: number = 0;
  totalHoras: number = 0;

  // Filtros
  filtroperiodo: string = 'mes';
  filtroEstado: string = 'todos';
  filtroMateria: string = 'todas';

  // Datos
  materias: Materia[] = [
    { id: 1, nombre: 'Cálculo Diferencial' },
    { id: 2, nombre: 'Álgebra Lineal' },
    { id: 3, nombre: 'Cálculo Integral' },
    { id: 4, nombre: 'Ecuaciones Diferenciales' },
    { id: 5, nombre: 'Matemáticas Discretas' }
  ];

  todasLasTutorias: Tutoria[] = [];
  tutoriasFiltradas: Tutoria[] = [];

  constructor(private router: Router) {
    // Registrar los íconos
    addIcons({
      'download-outline': downloadOutline,
      'checkmark-done-outline': checkmarkDoneOutline,
      'close-circle-outline': closeCircleOutline,
      'time-outline': timeOutline,
      'filter-outline': filterOutline,
      'person-outline': personOutline,
      'calendar-outline': calendarOutline,
      'hourglass-outline': hourglassOutline,
      'information-circle-outline': informationCircleOutline,
      'eye-outline': eyeOutline,
      'folder-open-outline': folderOpenOutline,
      'document-text-outline': documentTextOutline,
      'document-outline': documentOutline,
      'grid-outline': gridOutline
    });
  }

  ngOnInit() {
    console.log('Página de historial inicializada');
    this.cargarDatosEjemplo();
    this.aplicarFiltros();
    this.calcularEstadisticas();
  }

  cargarDatosEjemplo() {
    // Datos de ejemplo para visualización
    this.todasLasTutorias = [
      {
        id: 1,
        materia: 'Cálculo Diferencial',
        estudiante: 'María González',
        fecha: '2026-01-15',
        hora: '10:00 AM - 11:00 AM',
        duracion: 60,
        estado: 'Completada',
        fechaCompleta: new Date('2026-01-15T10:00:00')
      },
      {
        id: 2,
        materia: 'Álgebra Lineal',
        estudiante: 'Carlos Ramírez',
        fecha: '2026-01-18',
        hora: '02:00 PM - 03:00 PM',
        duracion: 60,
        estado: 'Completada',
        fechaCompleta: new Date('2026-01-18T14:00:00')
      },
      {
        id: 3,
        materia: 'Cálculo Integral',
        estudiante: 'Ana Martínez',
        fecha: '2026-01-20',
        hora: '09:00 AM - 10:00 AM',
        duracion: 60,
        estado: 'Cancelada',
        motivoCancelacion: 'El estudiante tuvo un imprevisto familiar y no pudo asistir',
        fechaCompleta: new Date('2026-01-20T09:00:00')
      },
      {
        id: 4,
        materia: 'Cálculo Diferencial',
        estudiante: 'Pedro Sánchez',
        fecha: '2026-01-22',
        hora: '11:00 AM - 12:00 PM',
        duracion: 60,
        estado: 'Completada',
        fechaCompleta: new Date('2026-01-22T11:00:00')
      },
      {
        id: 5,
        materia: 'Ecuaciones Diferenciales',
        estudiante: 'Laura Torres',
        fecha: '2026-01-25',
        hora: '03:00 PM - 04:00 PM',
        duracion: 60,
        estado: 'Completada',
        fechaCompleta: new Date('2026-01-25T15:00:00')
      },
      {
        id: 6,
        materia: 'Álgebra Lineal',
        estudiante: 'Diego Morales',
        fecha: '2026-01-28',
        hora: '10:00 AM - 11:30 AM',
        duracion: 90,
        estado: 'Completada',
        fechaCompleta: new Date('2026-01-28T10:00:00')
      },
      {
        id: 7,
        materia: 'Cálculo Diferencial',
        estudiante: 'Sofía Vargas',
        fecha: '2026-01-30',
        hora: '04:00 PM - 05:00 PM',
        duracion: 60,
        estado: 'Cancelada',
        motivoCancelacion: 'Tuve que cancelar debido a una reunión académica de último minuto',
        fechaCompleta: new Date('2026-01-30T16:00:00')
      },
      {
        id: 8,
        materia: 'Matemáticas Discretas',
        estudiante: 'Roberto Díaz',
        fecha: '2026-02-01',
        hora: '09:00 AM - 10:00 AM',
        duracion: 60,
        estado: 'Completada',
        fechaCompleta: new Date('2026-02-01T09:00:00')
      },
      {
        id: 9,
        materia: 'Cálculo Integral',
        estudiante: 'Valentina Cruz',
        fecha: '2026-02-03',
        hora: '02:00 PM - 03:00 PM',
        duracion: 60,
        estado: 'Completada',
        fechaCompleta: new Date('2026-02-03T14:00:00')
      },
      {
        id: 10,
        materia: 'Álgebra Lineal',
        estudiante: 'Andrés Ruiz',
        fecha: '2026-02-04',
        hora: '11:00 AM - 12:00 PM',
        duracion: 60,
        estado: 'Completada',
        fechaCompleta: new Date('2026-02-04T11:00:00')
      }
    ];
  }

  aplicarFiltros() {
    let resultado = [...this.todasLasTutorias];

    // Filtro por período
    const hoy = new Date();
    switch (this.filtroperiodo) {
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
      const materia = this.materias.find(m => m.id === Number(this.filtroMateria));
      if (materia) {
        resultado = resultado.filter(t => t.materia === materia.nombre);
      }
    }

    // Ordenar por fecha descendente (más recientes primero)
    resultado.sort((a, b) => b.fechaCompleta.getTime() - a.fechaCompleta.getTime());

    this.tutoriasFiltradas = resultado;
  }

  calcularEstadisticas() {
    this.totalCompletadas = this.tutoriasFiltradas.filter(t => t.estado === 'Completada').length;
    this.totalCanceladas = this.tutoriasFiltradas.filter(t => t.estado === 'Cancelada').length;

    const minutostotales = this.tutoriasFiltradas
      .filter(t => t.estado === 'Completada')
      .reduce((sum, t) => sum + t.duracion, 0);

    this.totalHoras = Math.round(minutostotales / 60);
  }

  onFiltroChange() {
    console.log('Filtros actualizados:', {
      periodo: this.filtroperiodo,
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
    // Aquí se abriría un modal o se navegaría a una página de detalles
  }

  onExportarReporte() {
    console.log('Exportar reporte general');
    // Aquí se generaría el reporte
  }

  exportarPDF() {
    console.log('Exportando a PDF...');
    // Aquí se generaría el PDF con las tutorías filtradas
  }

  exportarExcel() {
    console.log('Exportando a Excel...');
    // Aquí se generaría el Excel con las tutorías filtradas
  }
}
