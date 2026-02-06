import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  schoolOutline,
  mailOutline,
  lockClosedOutline
} from 'ionicons/icons';

import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonInput,
    IonButton,
    IonIcon
  ]
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    addIcons({
      'school-outline': schoolOutline,
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline
    });
  }

  ngOnInit() {}

  onLogin() {

    const data = {
      email: this.email,
      password: this.password
    };

    this.auth.login(data).subscribe((resp:any)=>{

      console.log(resp);

      // Guardar TOKEN
      localStorage.setItem('token', resp.token);

      // Guardar usuario
      localStorage.setItem('usuario', JSON.stringify(resp.usuario));

      // Redirección por rol
      if(resp.usuario.rol === 'docente'){
        this.router.navigate(['/profesor']);
      }else{
        this.router.navigate(['/estudiante']);
      }

    }, error=>{
      alert("Email o contraseña incorrectos");
    });

  }

}
