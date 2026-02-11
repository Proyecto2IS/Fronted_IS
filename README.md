# Fronted_IS
<h1>Frontend – Sistema de Gestión de Tutorías Académicas</h1>

<h2>Descripción General</h2>
<p>
El Frontend del Sistema de Gestión de Tutorías Académicas permite la interacción
entre estudiantes y docentes mediante una interfaz web intuitiva, clara y
responsiva. Está desarrollado con Angular e Ionic y se comunica con el backend
a través de una API REST segura.
</p>

<h2>Tecnologías Utilizadas</h2>
<ul>
  <li>Angular</li>
  <li>Ionic Framework</li>
  <li>TypeScript</li>
  <li>HTML</li>
  <li>SCSS</li>
  <li>Servicios HTTP (API REST)</li>
  <li>JWT para manejo de sesión</li>
</ul>

<h2>Estructura General</h2>
<p>
El frontend está organizado en componentes, páginas y servicios que permiten
una correcta separación de responsabilidades y una fácil escalabilidad.
</p>

<h2>Funcionalidades Principales</h2>

<h3>Inicio de Sesión</h3>
<ul>
  <li>Autenticación mediante correo institucional</li>
  <li>Validación de credenciales</li>
  <li>Mensajes de error claros ante accesos inválidos</li>
</ul>

<h3>Módulo Docente</h3>
<ul>
  <li>Panel principal con resumen de tutorías</li>
  <li>Gestión de disponibilidad horaria</li>
  <li>Visualización de solicitudes pendientes y procesadas</li>
  <li>Acceso al historial de tutorías</li>
  <li>Calendario académico interactivo</li>
</ul>

<h3>Gestión de Solicitudes</h3>
<ul>
  <li>Aceptación de solicitudes de tutoría</li>
  <li>Rechazo con propuesta de alternativas</li>
  <li>Actualización automática del estado de la solicitud</li>
</ul>

<h3>Historial y Reportes</h3>
<ul>
  <li>Consulta de tutorías realizadas, canceladas o pendientes</li>
  <li>Filtros por fecha, estado y materia</li>
  <li>Exportación de reportes en formato PDF</li>
</ul>

<h3>Calendario Académico</h3>
<ul>
  <li>Vista mensual de tutorías</li>
  <li>Identificación visual por colores según el estado</li>
  <li>Navegación entre meses y selección de fechas</li>
</ul>

<h2>Módulo Estudiante</h2>
<ul>
  <li>Página principal con información general del estudiante</li>
  <li>Acceso a solicitudes, historial y calendario</li>
  <li>Creación de nuevas solicitudes de tutoría</li>
  <li>Visualización del estado de cada solicitud</li>
</ul>

<h2>Integración con Backend</h2>
<p>
El frontend consume la API REST del backend mediante servicios HTTP de Angular.
El token JWT se almacena de forma segura y se envía en cada petición protegida
para garantizar la autenticación y autorización del usuario.
</p>

<h2>Ejecución del Proyecto</h2>
<pre>
npm install
ionic serve
</pre>

<h2>Desarrolladores Frontend</h2>
<ul>
  <li>Emily Yulexi Álava Dueñas – Dev Full Stack</li>
  <li>Alexi Alejandro Cevallos Santana – Dev Frontend</li>
</ul>
