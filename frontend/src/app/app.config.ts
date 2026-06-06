import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; // <-- Agregamos withFetch
import { provideClientHydration } from '@angular/platform-browser'; // <-- Esto ayuda con la hidratación
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()), // <-- Usar fetch nativo evita el bloqueo del SSR
    provideClientHydration()
  ]
};