# My Football API - Sistema de Gestión Deportiva

Proyecto desarrollado como parte de la formación en Full Stack. Este sistema permite la gestión y visualización de datasets de jugadores, implementando una arquitectura de software completa.

## Tecnologías Utilizadas
* Frontend: Angular (TypeScript).
* Backend: Node.js con Express y Sequelize.
* Base de Datos: MariaDB.
* Visualización: Chart.js.
* Infraestructura: Docker y Docker Compose.

## Características Principales
* CRUD completo para la gestión de registros.
* Pipeline de extracción y transformación de datos.
* Dashboards interactivos para el análisis de métricas técnicas.
* Diseño modular siguiendo buenas prácticas de Ingeniería de Software.

## Decisiones Técnicas y Funcionales

Durante el desarrollo del proyecto, se tomaron las siguientes decisiones de arquitectura:

*   **Arquitectura de Contenedores:** Se optó por Docker Compose para garantizar la portabilidad del entorno. Esto asegura que la aplicación se comporte de manera idéntica tanto en entornos de desarrollo como en producción, eliminando problemas de "en mi máquina funciona".
*   **Gestión de Base de Datos:** Se seleccionó MariaDB por su estabilidad y compatibilidad con el ecosistema de Node.js. Se implementó un script de inicialización (`init.sql`) para automatizar la carga del dataset inicial.
*   **Frontend:** Se utilizó Angular por su estructura modular y fuerte tipado con TypeScript, facilitando la escalabilidad del sistema y la mantenibilidad a largo plazo del código.
*   **Backend:** Se implementó una arquitectura basada en controladores y servicios para separar la lógica de negocio de las rutas de la API, mejorando la legibilidad y la reutilización del código.
*   **Seguridad:** Se integró un sistema de autenticación básica para proteger las rutas críticas, asegurando que solo usuarios autorizados puedan gestionar los datos.
*   **Visualización de Datos:** Se implementó Chart.js para procesar los datos de la API en el frontend, permitiendo una representación gráfica ágil y ligera de las métricas de los jugadores.

## Instalación y Ejecución
1. Clonar el repositorio:
   git clone https://github.com/TrejoNahuel/tpAcademy.git
   cd tpAcademy

2. Levantar los servicios:
   docker compose up --build

3. Acceder a la aplicación en: http://localhost:4200

## Autor
Nahuel Trejo
