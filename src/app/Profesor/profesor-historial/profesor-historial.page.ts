
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TutoriasService } from '../../Services/tutoria.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


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
 materiasMap = new Map<number, string>();
 estudiantesMap = new Map<number, string>();
  // Estadísticas
  totalPendientes = 0;
  totalConfirmadas = 0;
  totalFinalizadas = 0;
  totalCanceladas = 0;
  totalHoras = 0;

  // Filtros
  filtroperiodo: string = 'mes';
  filtroEstado: string = 'todos';
  filtroMateria: string = 'todas';


 // Datos
  materias: Materia[] = [];



  todasLasTutorias: Tutoria[] = [];
  tutoriasFiltradas: Tutoria[] = [];

  constructor(private router: Router, private tutoriaService: TutoriasService) {
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
  this.cargarCatalogos();
}
cargarCatalogos() {
  Promise.all([
    this.tutoriaService.getMaterias().toPromise(),
    this.tutoriaService.getEstudiantes().toPromise()
  ]).then(([materias, estudiantes]) => {

    if (materias) {
      this.materias = materias;
      materias.forEach((m:any) =>
        this.materiasMap.set(m.id, m.nombre)
      );
    }

    if (estudiantes) {
      estudiantes.forEach((e:any) =>
        this.estudiantesMap.set(e.id, e.nombre)
      );
    }

    // 👇 recién aquí cargas historial
    this.cargarHistorial();
  });
}
  cargarHistorial() {

  this.tutoriaService.obtenerTutoriasDocente()
    .subscribe((data: any) => {

      this.todasLasTutorias = data.map((t: { id: any; materia_id: number; estudiante_id: number; fecha: string | number | Date; hora_inicio: any; hora_fin: any; estado: any; motivo_cancelacion: any; duracion: any; }) => ({
        id: t.id,
        materia: this.materiasMap.get(t.materia_id) || 'Materia no encontrada',
        estudiante: this.estudiantesMap.get(t.estudiante_id) || 'Estudiante no encontrado',
        fecha: t.fecha,
        hora: `${t.hora_inicio} - ${t.hora_fin}`,
        estado: t.estado,
        motivoCancelacion: t.motivo_cancelacion,
        duracion: t.duracion,
        fechaCompleta: new Date(t.fecha)
      }));

      this.aplicarFiltros();
      this.calcularEstadisticas();
    });
}

  aplicarFiltros() {

  let resultado = [...this.todasLasTutorias];

  const hoy = new Date();

  // FILTRO PERIODO
  if (this.filtroperiodo !== 'todos') {

    let dias = 0;

    if(this.filtroperiodo === 'semana') dias = 7;
    if(this.filtroperiodo === 'mes') dias = 30;
    if(this.filtroperiodo === 'trimestre') dias = 90;
    if(this.filtroperiodo === 'semestre') dias = 180;

    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() - dias);

    resultado = resultado.filter(t =>
      t.fechaCompleta >= fechaLimite &&
      t.fechaCompleta <= hoy
    );
  }

  // FILTRO ESTADO
  if (this.filtroEstado !== 'todos') {
    resultado = resultado.filter(t =>
      t.estado.toLowerCase() === this.filtroEstado
    );
  }

  // FILTRO MATERIA
if (this.filtroMateria !== 'todas') {
  resultado = resultado.filter(t =>
    t.materia === this.filtroMateria
  );
}

  resultado.sort((a, b) => b.fechaCompleta.getTime() - a.fechaCompleta.getTime());

  this.tutoriasFiltradas = resultado;
}


  calcularEstadisticas(){

    // IMPORTANTE → usar todasLasTutorias
    this.totalPendientes =
      this.todasLasTutorias.filter(t => t.estado === 'pendiente').length;

    this.totalConfirmadas =
      this.todasLasTutorias.filter(t => t.estado === 'confirmada').length;

    this.totalFinalizadas =
      this.todasLasTutorias.filter(t => t.estado === 'finalizada').length;

    this.totalCanceladas =
      this.todasLasTutorias.filter(t => t.estado === 'cancelada').length;

    const minutosTotales = this.todasLasTutorias
      .filter(t => t.estado === 'finalizada')
      .reduce((sum, t) => sum + (t.duracion || 0), 0);

    this.totalHoras = Math.round(minutosTotales / 60);
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

  const colores:any = {
    'pendiente': 'warning',
    'confirmada': 'primary',
    'finalizada': 'success',
    'cancelada': 'danger'
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

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Reporte de Tutorías', 14, 15);

  const filas = this.tutoriasFiltradas.map(t => [
    t.materia,
    t.estudiante,
    t.fecha,
    t.hora,
    t.estado
  ]);

  autoTable(doc, {
    startY: 25,
    head: [['Materia', 'Estudiante', 'Fecha', 'Hora', 'Estado']],
    body: filas
  });

  doc.save('reporte_tutorias.pdf');
}

  exportarExcel() {
    console.log('Exportando a Excel...');
    // Aquí se generaría el Excel con las tutorías filtradas
  }
}
