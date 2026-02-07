export interface DisponibilidadInterface {
  id?: number;
  docente_id: number;
  dia_semana: 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes';
  hora_inicio: string;
  hora_fin: string;
}
