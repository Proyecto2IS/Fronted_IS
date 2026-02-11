import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  private apiUrl = 'http://localhost:3000/usuarios/docentes';

  constructor(private http: HttpClient) {}

  obtenerDocentes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
