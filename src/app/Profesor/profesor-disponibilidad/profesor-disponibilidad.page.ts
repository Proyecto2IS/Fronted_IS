
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
  IonItem,
  IonSelect,
  IonSelectOption,
  IonChip,
  IonLabel,
  IonInput
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  saveOutline,
  informationCircleOutline,
  bookOutline,
  checkmarkCircle,
  ellipseOutline,
  addCircleOutline,
  timeOutline,
  trashOutline,
  arrowForwardOutline,
  calendarOutline,
  peopleOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

interface Materia {
  id: number;
  nombre: string;
}

interface DiaSemana {
  id: number;
  nombre: string;
  seleccionado: boolean;
}

interface FranjaHoraria {
  horaInicio: string;
  horaFin: string;
  duracion: string;
}

@Component({
  selector: 'app-profesor-disponibilidad',
  templateUrl: './profesor-disponibilidad.page.html',
  styleUrls: ['./profesor-disponibilidad.page.scss'],
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
    IonSelect,
    IonSelectOption,
    IonChip,
    IonLabel,
    IonInput
  ]
})
export class ProfesorDisponibilidadPage implements OnInit {

  materiaSeleccionada: number | null = null;

  materias: Materia[] = [
    { id: 1, nombre: 'Cálculo Diferencial' },
    { id: 2, nombre: 'Álgebra Lineal' },
    { id: 3, nombre: 'Cálculo Integral' },
    { id: 4, nombre: 'Ecuaciones Diferenciales' },
    { id: 5, nombre: 'Matemáticas Discretas' }
  ];

  diasSemana: DiaSemana[] = [
    { id: 1, nombre: 'Lunes', seleccionado: false },
    { id: 2, nombre: 'Martes', seleccionado: false },
    { id: 3, nombre: 'Miércoles', seleccionado: false },
    { id: 4, nombre: 'Jueves', seleccionado: false },
    { id: 5, nombre: 'Viernes', seleccionado: false },
    { id: 6, nombre: 'Sábado', seleccionado: false }
  ];

  franjasHorarias: FranjaHoraria[] = [];

  constructor(private router: Router) {
    // Registrar los íconos
    addIcons({
      'save-outline': saveOutline,
      'information-circle-outline': informationCircleOutline,
      'book-outline': bookOutline,
      'checkmark-circle': checkmarkCircle,
      'ellipse-outline': ellipseOutline,
      'add-circle-outline': addCircleOutline,
      'time-outline': timeOutline,
      'trash-outline': trashOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'calendar-outline': calendarOutline,
      'people-outline': peopleOutline,
      'checkmark-circle-outline': checkmarkCircleOutline
    });
  }

  ngOnInit() {
    // Aquí se cargaría la disponibilidad actual del profesor
    console.log('Página de disponibilidad inicializada');
    this.cargarDatosEjemplo();
  }

  cargarDatosEjemplo() {
    // Datos de ejemplo para visualización
    this.materiaSeleccionada = 1;
    this.diasSemana[0].seleccionado = true; // Lunes
    this.diasSemana[2].seleccionado = true; // Miércoles
    this.diasSemana[4].seleccionado = true; // Viernes

    this.franjasHorarias = [
      { horaInicio: '08:00', horaFin: '12:00', duracion: '60' },
      { horaInicio: '14:00', horaFin: '17:00', duracion: '45' }
    ];
  }

  onMateriaChange() {
    console.log('Materia seleccionada:', this.materiaSeleccionada);
    // Aquí se cargaría la disponibilidad específica de esa materia
  }

  toggleDia(dia: DiaSemana) {
    dia.seleccionado = !dia.seleccionado;
    console.log(`${dia.nombre} ${dia.seleccionado ? 'seleccionado' : 'deseleccionado'}`);
  }

  agregarFranja() {
    const nuevaFranja: FranjaHoraria = {
      horaInicio: '',
      horaFin: '',
      duracion: '60'
    };
    this.franjasHorarias.push(nuevaFranja);
    console.log('Nueva franja agregada');
  }

  eliminarFranja(index: number) {
    this.franjasHorarias.splice(index, 1);
    console.log('Franja eliminada:', index);
  }

  getDiasSeleccionados(): string {
    const diasSeleccionados = this.diasSemana
      .filter(dia => dia.seleccionado)
      .map(dia => dia.nombre);

    if (diasSeleccionados.length === 0) {
      return 'Ninguno';
    }

    return diasSeleccionados.join(', ');
  }

  getMateriaSeleccionada(): string {
    if (!this.materiaSeleccionada) {
      return 'No seleccionada';
    }

    const materia = this.materias.find(m => m.id === this.materiaSeleccionada);
    return materia ? materia.nombre : 'No seleccionada';
  }

  validarFormulario(): boolean {
    if (!this.materiaSeleccionada) {
      console.log('Error: Debe seleccionar una materia');
      return false;
    }

    const hayDiasSeleccionados = this.diasSemana.some(dia => dia.seleccionado);
    if (!hayDiasSeleccionados) {
      console.log('Error: Debe seleccionar al menos un día');
      return false;
    }

    if (this.franjasHorarias.length === 0) {
      console.log('Error: Debe agregar al menos una franja horaria');
      return false;
    }

    for (let i = 0; i < this.franjasHorarias.length; i++) {
      const franja = this.franjasHorarias[i];
      if (!franja.horaInicio || !franja.horaFin) {
        console.log(`Error: La franja ${i + 1} tiene horarios incompletos`);
        return false;
      }

      if (franja.horaInicio >= franja.horaFin) {
        console.log(`Error: La franja ${i + 1} tiene horarios inválidos`);
        return false;
      }
    }

    return true;
  }

  onSave() {
    console.log('Intentando guardar disponibilidad...');

    if (!this.validarFormulario()) {
      // Aquí mostrarías un toast o alerta al usuario
      console.log('Formulario inválido');
      return;
    }

    const disponibilidad = {
      materiaId: this.materiaSeleccionada,
      dias: this.diasSemana.filter(d => d.seleccionado).map(d => d.id),
      franjas: this.franjasHorarias
    };

    console.log('Disponibilidad a guardar:', disponibilidad);

    // Aquí se enviaría al servicio
    // this.disponibilidadService.guardar(disponibilidad).subscribe(...)

    // Navegar de regreso
    // this.router.navigate(['/profesor']);
  }

  onCancel() {
    console.log('Cancelando edición');
    // this.router.navigate(['/profesor']);
  }
}

