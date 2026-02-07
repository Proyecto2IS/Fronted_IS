export interface TutoriaInterface {
  id?: number;
  estudiante_id: number;
  docente_id: number;
  materia_id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  tema?: string;
  numero_estudiantes_solicitados: number;
  numero_estudiantes_asistieron?: number;
  estado?: 'pendiente' | 'confirmada' | 'rechazada' | 'cancelada' | 'finalizada';
  motivo_cancelacion?: string;
}
