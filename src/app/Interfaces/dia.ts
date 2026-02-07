import { Horario } from "./horario";

export interface Dia {
  nombre: string;
  fecha: string;
  horarios: Horario[];
}
