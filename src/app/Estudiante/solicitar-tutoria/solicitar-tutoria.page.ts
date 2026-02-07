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

  constructor(private router: Router) {
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
    // Según requisitos: "El sistema debe exigir como primer paso la selección obligatoria de una materia"
    this.materias = [
      { id: 1, nombre: 'Cálculo Diferencial', codigo: 'MAT-101' },
      { id: 2, nombre: 'Álgebra Lineal', codigo: 'MAT-102' },
      { id: 3, nombre: 'Programación I', codigo: 'INF-101' },
      { id: 4, nombre: 'Física I', codigo: 'FIS-101' },
      { id: 5, nombre: 'Cálculo Integral', codigo: 'MAT-201' },
      { id: 6, nombre: 'Estadística', codigo: 'MAT-103' }
    ];
  }

  seleccionarMateria(materia: Materia) {
    this.materiaSeleccionada = materia;
    console.log('Materia seleccionada:', materia);
  }

  cargarDocentes() {
    // Según requisitos: "El sistema debe mostrar únicamente docentes asociados a la materia seleccionada
    // y con disponibilidad registrada"
    this.docentesDisponibles = [
      {
        id: 1,
        nombre: 'Dr. Juan Pérez',
        email: 'juan.perez@universidad.edu.ec',
        horariosDisponibles: 8
      },
      {
        id: 2,
        nombre: 'Dra. Ana Torres',
        email: 'ana.torres@universidad.edu.ec',
        horariosDisponibles: 5
      },
      {
        id: 3,
        nombre: 'Ing. María Rodríguez',
        email: 'maria.rodriguez@universidad.edu.ec',
        horariosDisponibles: 12
      }
    ];
  }

  seleccionarDocente(docente: Docente) {
    this.docenteSeleccionado = docente;
    console.log('Docente seleccionado:', docente);
  }

  cargarHorarios() {
    // Según requisitos: "El sistema debe mostrar un calendario visual con días y horarios disponibles
    // del docente seleccionado"
    this.semanaActualTexto = '07 - 13 Feb 2026';

    this.diasSemana = [
      {
        nombre: 'Lunes',
        fecha: '07 Feb',
        horarios: [
          { id: 'lun-8', hora: '08:00 - 09:00', disponible: true },
          { id: 'lun-9', hora: '09:00 - 10:00', disponible: false },
          { id: 'lun-10', hora: '10:00 - 11:00', disponible: true, conflicto: true },
          { id: 'lun-14', hora: '14:00 - 15:00', disponible: true },
          { id: 'lun-15', hora: '15:00 - 16:00', disponible: false }
        ]
      },
      {
        nombre: 'Martes',
        fecha: '08 Feb',
        horarios: [
          { id: 'mar-9', hora: '09:00 - 10:00', disponible: true },
          { id: 'mar-10', hora: '10:00 - 11:00', disponible: true },
          { id: 'mar-11', hora: '11:00 - 12:00', disponible: false },
          { id: 'mar-14', hora: '14:00 - 15:00', disponible: true },
          { id: 'mar-16', hora: '16:00 - 17:00', disponible: true }
        ]
      },
      {
        nombre: 'Miércoles',
        fecha: '09 Feb',
        horarios: [
          { id: 'mie-8', hora: '08:00 - 09:00', disponible: true },
          { id: 'mie-10', hora: '10:00 - 11:00', disponible: true },
          { id: 'mie-11', hora: '11:00 - 12:00', disponible: false },
          { id: 'mie-15', hora: '15:00 - 16:00', disponible: true },
          { id: 'mie-16', hora: '16:00 - 17:00', disponible: false }
        ]
      },
      {
        nombre: 'Jueves',
        fecha: '10 Feb',
        horarios: [
          { id: 'jue-9', hora: '09:00 - 10:00', disponible: false },
          { id: 'jue-10', hora: '10:00 - 11:00', disponible: true },
          { id: 'jue-14', hora: '14:00 - 15:00', disponible: true },
          { id: 'jue-15', hora: '15:00 - 16:00', disponible: true },
          { id: 'jue-16', hora: '16:00 - 17:00', disponible: false }
        ]
      },
      {
        nombre: 'Viernes',
        fecha: '11 Feb',
        horarios: [
          { id: 'vie-8', hora: '08:00 - 09:00', disponible: true },
          { id: 'vie-9', hora: '09:00 - 10:00', disponible: true },
          { id: 'vie-10', hora: '10:00 - 11:00', disponible: false },
          { id: 'vie-14', hora: '14:00 - 15:00', disponible: false },
          { id: 'vie-15', hora: '15:00 - 16:00', disponible: true }
        ]
      }
    ];
  }

  cambiarSemana(direccion: number) {
    console.log('Cambiar semana:', direccion);
    // Aquí se cargarían los horarios de la semana anterior o siguiente
  }

  seleccionarHorario(horario: Horario, dia: Dia) {
    // Según requisitos:
    // "El sistema debe bloquear automáticamente horarios ocupados o no disponibles del docente"
    // "El sistema debe permitir al estudiante seleccionar fecha y hora solo dentro de los bloques disponibles"
    // "El sistema debe impedir que el estudiante solicite una tutoría en un horario donde ya tenga otra tutoría"

    if (!horario.disponible || horario.conflicto) {
      console.log('Horario no disponible o en conflicto');
      return;
    }

    this.horarioSeleccionado = horario;
    this.fechaSeleccionadaTexto = `${dia.nombre}, ${dia.fecha}`;
    console.log('Horario seleccionado:', horario, 'Día:', dia);
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

  const solicitud = {
    estudiante_id: 1, // luego lo sacas del token
    docente_id: this.docenteSeleccionado!.id,
    materia_id: this.materiaSeleccionada!.id,
    fecha: '2026-02-07', // luego lo calculas bien
    hora_inicio: inicio,
    hora_fin: fin,
    numero_estudiantes_solicitados: 1,
    tema: this.motivoSolicitud,
    estado: 'pendiente'
  };

  console.log('Solicitud lista para backend:', solicitud);

  // this.tutoriasService.crearTutoria(solicitud).subscribe();
}

}
