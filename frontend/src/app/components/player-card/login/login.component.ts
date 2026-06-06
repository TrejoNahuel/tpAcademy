import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-box">
      <h2>LOGIN</h2>
      <input [(ngModel)]="creds.username" placeholder="Usuario">
      <input [(ngModel)]="creds.password" type="password" placeholder="Contraseña">
      <button (click)="onLogin()">INGRESAR</button>
    </div>
  `,
  styles: [`
    .login-box { display: flex; flex-direction: column; gap: 10px; max-width: 300px; margin: 100px auto; padding: 20px; border: 1px solid #415a77; }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  creds = { username: '', password: '' };

  onLogin() {
    this.auth.login(this.creds).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => alert('Error: Usuario o contraseña incorrectos')
    });
  }
}