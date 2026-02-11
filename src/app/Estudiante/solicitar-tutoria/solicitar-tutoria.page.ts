import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PropuestaAlternativaInterface } from 'src/app/Interfaces/propuesta-alternativa.interface';
import { DisponibilidadInterface } from 'src/app/Interfaces/disponibilidad.interface';
import { Materia } from 'src/app/Interfaces/materia';
import { Docente } from 'src/app/Interfaces/docente';
import { Horario } from 'src/app/Interfaces/horario';
import { Dia } from 'src/app/Interfaces/dia';
import { Router } from '@angular/router';
import {IonButtons,IonBackButton,IonButton,IonIcon,IonCard,IonCardContent,IonItem,IonTextarea} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { TutoriaInterface } from 'src/app/Interfaces/tutoria.interface';
import { TutoriasService } from 'src/app/Services/tutoria.service';

import {
  checkmark,
  bookOutline,
  book,
  checkmarkCircle,
  peopleOutline,
  person,
  timeOutline,
  calendarOutline,
  chevronBackOutline,
  chevronForwardOutline,
  lockClosedOutline,
  alertCircle,
  checkmarkCircleOutline,
  personOutline,
  arrowForwardOutline,
  arrowBackOutline,
  sendOutline,
  alertCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-solicitar-tutoria',
  templateUrl: './solicitar-tutoria.page.html',
  styleUrls: ['./solicitar-tutoria.page.scss'],
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
    IonItem,
    IonTextarea
  ]
})
export class SolicitarTutoriaPage implements OnInit {
 pasoActual: number = 1;

  // Paso 1: Materia
  materias: Materia[] = [];
  materiaSeleccionada: Materia | null = null;

  // Paso 2: Docente
  docentesDisponibles: Docente[] = [];
  docenteSeleccionado: Docente | null = null;

  // Paso 3: Horario
  semanaActualTexto: string = '';
  diasSemana: Dia[] = [];
  horarioSeleccionado: Horario | null = null;
  fechaSeleccionadaTexto: string = '';

  // Paso 4: Confirmación
  motivoSolicitud: string = '';

  fechaSeleccionadaReal: string = '';

  constructor(private router: Router, private tutoriaService: TutoriasService) {
    // Registrar los íconos
    addIcons({
      'checkmark': checkmark,
      'book-outline': bookOutline,
      'book': book,
      'checkmark-circle': checkmarkCircle,
      'people-outline': peopleOutline,
      'person': person,
      'time-outline': timeOutline,
      'calendar-outline': calendarOutline,
      'chevron-back-outline': chevronBackOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'lock-closed-outline': lockClosedOutline,
      'alert-circle': alertCircle,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'person-outline': personOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'arrow-back-outline': arrowBackOutline,
      'send-outline': sendOutline,
      'alert-circle-outline': alertCircleOutline
    });
  }

  ngOnInit() {
    console.log('Página de solicitar tutoría inicializada');
    this.cargarMaterias();
  }

  cargarMaterias() {
  this.tutoriaService.getMaterias().subscribe({
    next: (resp: Materia[]) => {
      this.materias = resp;
    },
    error: err => {
      console.error('Error cargando materias', err);
    }
  });
}


  seleccionarMateria(materia: Materia) {
    this.materiaSeleccionada = materia;
    console.log('Materia seleccionada:', materia);
  }

  cargarDocentes() {
  if (!this.materiaSeleccionada) return;

  this.tutoriaService
    .getDocentesPorMateria(this.materiaSeleccionada.id)
    .subscribe({
      next: (resp) => {
        this.docentesDisponibles = resp;
        console.log('Docentes desde BD:', resp);
      },
      error: (err) => {
        console.error('Error cargando docentes', err);
      }
    });
}

  seleccionarDocente(docente: Docente) {
    this.docenteSeleccionado = docente;
    console.log('Docente seleccionado:', docente);
  }

cargarHorarios() {
  if (!this.docenteSeleccionado) return;

  this.tutoriaService
    .getDisponibilidadDocente(this.docenteSeleccionado.id)
    .subscribe({
      next: (resp) => {
        console.log('Disponibilidad real:', resp);

        // Transformamos la disponibilidad en tu estructura visual
        this.diasSemana = this.transformarDisponibilidad(resp);
        console.log('Disponibilidad real:', resp);
      },
      error: (err) => {
        console.error('Error cargando disponibilidad', err);
      }
    });
}
private transformarDisponibilidad(data: any[]): Dia[] {

  const hoy = new Date();
  const diasSemanaMap: any = {
    'Lunes': 1,
    'Martes': 2,
    'Miercoles': 3,
    'Jueves': 4,
    'Viernes': 5
  };

  const diasAgrupados: { [key: string]: Dia } = {};

  data.forEach(item => {

    if (!diasAgrupados[item.dia_semana]) {

      const numeroDia = diasSemanaMap[item.dia_semana];

      const fecha = new Date();
      const diaActual = fecha.getDay();

      const diferencia = numeroDia - diaActual;
      fecha.setDate(fecha.getDate() + diferencia);

      const fechaFormateada = fecha.toISOString().split('T')[0];

      diasAgrupados[item.dia_semana] = {
        nombre: item.dia_semana,
        fecha: fechaFormateada,
        horarios: []
      };
    }

    diasAgrupados[item.dia_semana].horarios.push({
      id: item.id.toString(),
      hora: `${item.hora_inicio} - ${item.hora_fin}`,
      disponible: true
    });

  });

  return Object.values(diasAgrupados);
}

  cambiarSemana(direccion: number) {
    console.log('Cambiar semana:', direccion);
    // Aquí se cargarían los horarios de la semana anterior o siguiente
  }

 seleccionarHorario(horario: Horario, dia: Dia) {

  if (!horario.disponible || horario.conflicto) return;

  this.horarioSeleccionado = horario;
  this.fechaSeleccionadaReal = dia.fecha;
  this.fechaSeleccionadaTexto = `${dia.nombre}, ${dia.fecha}`;
}

  siguientePaso() {
    if (this.pasoActual === 1 && this.materiaSeleccionada) {
      this.cargarDocentes();
      this.pasoActual = 2;
    } else if (this.pasoActual === 2 && this.docenteSeleccionado) {
      this.cargarHorarios();
      this.pasoActual = 3;
    } else if (this.pasoActual === 3 && this.horarioSeleccionado && !this.horarioSeleccionado.conflicto) {
      this.pasoActual = 4;
    }

    console.log('Paso actual:', this.pasoActual);
  }

  pasoAnterior() {
    if (this.pasoActual > 1) {
      this.pasoActual--;
      console.log('Paso actual:', this.pasoActual);
    }
  }

  validarSolicitud(): boolean {
    // Según requisitos: "El sistema debe validar todas las restricciones antes de permitir el envío"

    if (!this.materiaSeleccionada) {
      console.log('Error: No se ha seleccionado materia');
      return false;
    }

    if (!this.docenteSeleccionado) {
      console.log('Error: No se ha seleccionado docente');
      return false;
    }

    if (!this.horarioSeleccionado) {
      console.log('Error: No se ha seleccionado horario');
      return false;
    }

    if (this.horarioSeleccionado.conflicto) {
      console.log('Error: El horario tiene conflicto con otra tutoría');
      return false;
    }

    return true;
  }
private separarHoras(hora: string): { inicio: string; fin: string } {
  const [inicio, fin] = hora.split(' - ');
  return { inicio, fin };
}

enviarSolicitud() {

  if (!this.validarSolicitud()) return;

  const { inicio, fin } = this.separarHoras(
    this.horarioSeleccionado!.hora
  );

  const solicitud: TutoriaInterface = {
    docente_id: this.docenteSeleccionado!.id,
    materia_id: this.materiaSeleccionada!.id,
    fecha: this.fechaSeleccionadaReal,
    hora_inicio: inicio,
    hora_fin: fin,
    numero_estudiantes_solicitados: 1,
    tema: this.motivoSolicitud,
    estudiante_id: 0 // 👈 el backend lo reemplaza con el del token
  };

  this.tutoriaService.crearTutoria(solicitud).subscribe({
    next: () => {
      this.router.navigate(['/estudiante']);
    },
    error: (err) => {
      console.error('Error creando tutoría', err);
    }
  });
}

}
