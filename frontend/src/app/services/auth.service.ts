import { Injectable, inject, PLATFORM_ID } from '@angular/core'; // 1. Importa PLATFORM_ID
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common'; // 2. Importa isPlatformBrowser
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID); // 3. Inyecta la plataforma
  private apiUrl = 'http://localhost:3000/api/auth';

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(tap(res => {
        // 4. Solo guardamos si estamos en el navegador
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
        }
      }));
  }

  isLoggedIn(): boolean {
    // 5. Verificamos que sea navegador ANTES de leer
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false; // Si estamos en el servidor, devolvemos false por seguridad
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }
}