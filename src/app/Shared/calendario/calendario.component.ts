import { Component, OnInit } from '@angular/core';

import { Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronForwardOutline,
  todayOutline,
  calendarOutline,
  listOutline,
  timeOutline,
  bookOutline,
  hourglassOutline,
  eyeOutline,
  calendarClearOutline,
  closeOutline
} from 'ionicons/icons';
import { TutoriasService } from 'src/app/Services/tutoria.service';
import { TutoriaInterface } from 'src/app/Interfaces/tutoria.interface';
import { Router } from '@angular/router';
export interface EventoCalendario {
  id: number;
  titulo: string;
  subtitulo: string;
  materia: string;
  fecha: Date;
  hora: string;
  duracion?: number;
  estado: 'Confirmada' | 'Pendiente' | 'Cancelada';
}

interface DiaCalendario {
  numero: number;
  delMesActual: boolean;
  esHoy: boolean;
  seleccionado: boolean;
  fecha: Date;
  eventos: EventoCalendario[];
  diaSemana?: string;
  fechaCompleta?: string;
}

interface EventoAgrupado {
  dia: string;
  mes: string;
  diaSemana: string;
  cantidad: number;
  eventos: EventoCalendario[];
}
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    IonBadge
  ]
})
export class CalendarioComponent  implements OnInit {

  @Input() eventos: EventoCalendario[] = [];
  @Output() eventoSeleccionado = new EventEmitter<EventoCalendario>();

  @Input() rol: 'docente' | 'estudiante' = 'estudiante';

  vistaActual: 'mes' | 'lista' = 'mes';
  mesActual: Date = new Date();
  mesActualTexto: string = '';

  diasSemanaHeader: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  diasDelMes: DiaCalendario[] = [];

  diaSeleccionado: DiaCalendario | null = null;
  eventosAgrupados: EventoAgrupado[] = [];

  constructor(
    private tutoriasService: TutoriasService,
    private router: Router
  ) {
    // Registrar íconos
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'today-outline': todayOutline,
      'calendar-outline': calendarOutline,
      'list-outline': listOutline,
      'time-outline': timeOutline,
      'book-outline': bookOutline,
      'hourglass-outline': hourglassOutline,
      'eye-outline': eyeOutline,
      'calendar-clear-outline': calendarClearOutline,
      'close-outline': closeOutline
    });
  }

  ngOnInit() {
    // Detectar rol: primero desde localStorage, luego usar el @Input
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      try {
        const usuario = JSON.parse(usuarioStorage);
        if (usuario.rol) {
          this.rol = usuario.rol;
        }
      } catch (e) {
        console.error('Error al parsear usuario de localStorage', e);
      }
    }

    this.cargarTutorias();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rol'] && !changes['rol'].firstChange) {
      this.cargarTutorias();
    }
    if (changes['eventos'] && !changes['eventos'].firstChange) {
      this.generarCalendario();
      this.agruparEventosPorFecha();
    }
  }

cargarTutorias() {
  const request =
    this.rol === 'docente'
      ? this.tutoriasService.getTutoriasDocente()
      : this.tutoriasService.obtenerTutoriasEstudiante();

  request.subscribe({
    next: (tutorias) => {

      const filtradas = tutorias.filter(t =>
        ['confirmada', 'pendiente', 'cancelada'].includes(
          (t.estado || '').toLowerCase()
        )
      );

      this.eventos = filtradas.map(t =>
        this.mapearTutoriaAEvento(t)
      );

      this.generarCalendario();
      this.agruparEventosPorFecha();
    }
  });
}
mapearTutoriaAEvento(t: TutoriaInterface): EventoCalendario {

  const [year, month, day] = t.fecha.split('-').map(Number);
  const [hour, minute] = t.hora_inicio.split(':').map(Number);

  const fechaCompleta = new Date(
    year,
    month - 1, // JS empieza en 0
    day,
    hour,
    minute
  );

  return {
    id: t.id!,
    titulo: t.tema || 'Tutoría',
    subtitulo: `Docente ID: ${t.docente_id}`,
    materia: `Materia ID: ${t.materia_id}`,
    fecha: fechaCompleta,
    hora: `${t.hora_inicio} - ${t.hora_fin}`,
    duracion: this.calcularDuracion(t.hora_inicio, t.hora_fin),
    estado: this.mapearEstado(t.estado)
  };
}

 mapearEstado(
  estado: string | undefined
): 'Confirmada' | 'Pendiente' | 'Cancelada' {

  if (!estado) return 'Cancelada'; // o lo que tenga sentido para ti

  const estadoMap: any = {
    confirmada: 'Confirmada',
    pendiente: 'Pendiente',
    cancelada: 'Cancelada',
    rechazada: 'Cancelada',
    finalizada: 'Confirmada'
  };

  return estadoMap[estado.toLowerCase()] ?? 'Cancelada';
}
calcularDuracion(inicio: string, fin: string): number {
  const [h1, m1] = inicio.split(':').map(Number);
  const [h2, m2] = fin.split(':').map(Number);

  const minutosInicio = h1 * 60 + m1;
  const minutosFin = h2 * 60 + m2;

  return minutosFin - minutosInicio;
}
  generarCalendario() {
    const year = this.mesActual.getFullYear();
    const month = this.mesActual.getMonth();

    // Actualizar texto del mes
    this.mesActualTexto = this.mesActual.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
    });
    this.mesActualTexto = this.mesActualTexto.charAt(0).toUpperCase() + this.mesActualTexto.slice(1);

    // Primer y último día del mes
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);

    // Días a mostrar del mes anterior
    const diasAnterior = primerDia.getDay();
    const inicioCalendario = new Date(primerDia);
    inicioCalendario.setDate(primerDia.getDate() - diasAnterior);

    // Generar 42 días (6 semanas)
    this.diasDelMes = [];
    const fechaActual = new Date(inicioCalendario);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const esMesActual = fechaActual.getMonth() === month;
      const esHoy = fechaActual.toDateString() === hoy.toDateString();

      // Buscar eventos para este día
      const eventosDelDia = this.eventos.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        fechaEvento.setHours(0, 0, 0, 0);
        const fechaDia = new Date(fechaActual);
        fechaDia.setHours(0, 0, 0, 0);
        return fechaEvento.getTime() === fechaDia.getTime();
      });

      this.diasDelMes.push({
        numero: fechaActual.getDate(),
        delMesActual: esMesActual,
        esHoy: esHoy,
        seleccionado: false,
        fecha: new Date(fechaActual),
        eventos: eventosDelDia
      });

      fechaActual.setDate(fechaActual.getDate() + 1);
    }
  }

  agruparEventosPorFecha() {
    // Agrupar eventos por fecha para la vista de lista
    const grupos = new Map<string, EventoCalendario[]>();

    this.eventos.forEach(evento => {
      const fecha = new Date(evento.fecha);
      fecha.setHours(0, 0, 0, 0);
      const key = fecha.toISOString();

      if (!grupos.has(key)) {
        grupos.set(key, []);
      }
      grupos.get(key)!.push(evento);
    });

    this.eventosAgrupados = Array.from(grupos.entries())
      .map(([key, eventos]) => {
        const fecha = new Date(key);
        return {
          dia: fecha.getDate().toString().padStart(2, '0'),
          mes: fecha.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase(),
          diaSemana: fecha.toLocaleDateString('es-ES', { weekday: 'long' }),
          cantidad: eventos.length,
          eventos: eventos.sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
        };
      })
      .sort((a, b) => {
        const fechaA = new Date(a.eventos[0].fecha);
        const fechaB = new Date(b.eventos[0].fecha);
        return fechaA.getTime() - fechaB.getTime();
      });
  }

  mesAnterior() {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() - 1, 1);
    this.generarCalendario();
  }

  mesSiguiente() {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 1);
    this.generarCalendario();
  }

  irHoy() {
    this.mesActual = new Date();
    this.generarCalendario();
  }

  cambiarVista() {
    this.vistaActual = this.vistaActual === 'mes' ? 'lista' : 'mes';

    if (this.vistaActual === 'lista') {
      this.agruparEventosPorFecha();
    }
  }

  seleccionarDia(dia: DiaCalendario) {
    // Deseleccionar todos los días
    this.diasDelMes.forEach(d => d.seleccionado = false);

    // Seleccionar el día clickeado
    dia.seleccionado = true;

    // Preparar información del día para el detalle
    dia.diaSemana = dia.fecha.toLocaleDateString('es-ES', { weekday: 'long' });
    dia.diaSemana = dia.diaSemana.charAt(0).toUpperCase() + dia.diaSemana.slice(1);
    dia.fechaCompleta = dia.fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    this.diaSeleccionado = dia;
    console.log('Día seleccionado:', dia);
  }

  cerrarDetalle() {
    this.diaSeleccionado = null;
    this.diasDelMes.forEach(d => d.seleccionado = false);
  }

  verDetalleEvento(evento: EventoCalendario) {
    console.log('Ver detalle de evento:', evento);
    this.eventoSeleccionado.emit(evento);
    this.router.navigate(['/estudiante-solicitudes', evento.id]);
  }

  getColorEstado(estado: string): string {
    const colores: { [key: string]: string } = {
      'Confirmada': 'success',
      'Pendiente': 'warning',
      'Cancelada': 'danger'
    };
    return colores[estado] || 'medium';
  }
}
