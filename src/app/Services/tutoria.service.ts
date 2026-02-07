import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TutoriasService {

  API = "http://localhost:3000/tutorias";

  constructor(private http: HttpClient) {}

  getTutoriasDocente(){

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.API}/docente`, { headers });
  }

}

