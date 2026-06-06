import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PlayerService } from './services/player.service';
import { PlayerCardComponent } from './components/player-card/player-card.component';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, PlayerCardComponent], 
  template: `
    @if (!isAuthenticated) {
      <div class="login-fullscreen">
        <form class="login-box" (submit)="login(); $event.preventDefault()" autocomplete="off">
          <h1 style="color: #ff4655; margin-bottom: 20px;">ACCESO AL SISTEMA</h1>
          <input name="user" [(ngModel)]="creds.username" placeholder="Usuario" class="terminal-select" autocomplete="new-password">
          <input name="pass" [(ngModel)]="creds.password" type="password" placeholder="Contraseña" class="terminal-select" autocomplete="new-password">
          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button type="submit" class="btn-filter" style="flex: 1;">INGRESAR</button>
            <button type="button" (click)="register()" class="btn-filter" style="flex: 1; background-color: #415a77;">REGISTRARSE</button>
          </div>
        </form>
      </div>
    } 
    @else {
      <main class="dashboard">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h1>PLAYER ANALYTICS</h1>
          <div style="display: flex; gap: 10px;">
            <button class="btn-filter" (click)="toggleCreateForm()" style="background-color: #00d4ff; color: #0d1b2a;">
              {{ showCreateForm ? 'Cancelar' : '+ Nuevo Jugador' }}
            </button>
            <button class="btn-filter" (click)="logout()" style="background-color: #415a77;">Cerrar Sesión</button>
          </div>
        </div>

        @if (showCreateForm) {
          <div style="background: #1b263b; padding: 20px; border-radius: 8px; border: 1px solid #00d4ff; margin-bottom: 20px;">
          <h3 style="color: #00d4ff; margin-top: 0;">INGRESAR NUEVO REGISTRO</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
              
              <div style="grid-column: 1 / -1; border-bottom: 1px solid #415a77; padding-bottom: 5px; color: #8d99ae; font-size: 14px; margin-top: 5px;">DATOS DEL PERFIL</div>
              
              <div class="filter-group"><label>Nombre</label><input [(ngModel)]="newPlayer.name" class="terminal-select"></div>
              <div class="filter-group"><label>Nación</label>
                <select [(ngModel)]="newPlayer.country" class="terminal-select">
                  @for (country of countries; track country) { <option [value]="country">{{ country }}</option> }
                </select>
              </div>
              <div class="filter-group"><label>Club</label>
                <select [(ngModel)]="newPlayer.club" class="terminal-select">
                  @for (club of clubs; track club) { <option [value]="club">{{ club }}</option> }
                </select>
              </div>
              <div class="filter-group"><label>Edición</label>
                <select [(ngModel)]="newPlayer.year" class="terminal-select">
                  @for (version of versions; track version) { <option [value]="version">FIFA {{ version }}</option> }
                </select>
              </div>
              <div class="filter-group"><label>Género</label>
                <select [(ngModel)]="newPlayer.gender" class="terminal-select">
                  <option value="M">Masculino</option><option value="F">Femenino</option>
                </select>
              </div>

              <div style="grid-column: 1 / -1; border-bottom: 1px solid #415a77; padding-bottom: 5px; color: #8d99ae; font-size: 14px; margin-top: 15px;">MÉTRICAS TÉCNICAS</div>
              
              <div class="filter-group"><label>Media (OVR)</label><input type="number" min="1" max="99" [(ngModel)]="newPlayer.overall" class="terminal-select"></div>
              <div class="filter-group"><label>Pace</label><input type="number" min="1" max="99" [(ngModel)]="newPlayer.pace" class="terminal-select"></div>
              <div class="filter-group"><label>Shooting</label><input type="number" min="1" max="99" [(ngModel)]="newPlayer.shooting" class="terminal-select"></div>
              <div class="filter-group"><label>Passing</label><input type="number" min="1" max="99" [(ngModel)]="newPlayer.passing" class="terminal-select"></div>
              <div class="filter-group"><label>Dribbling</label><input type="number" min="1" max="99" [(ngModel)]="newPlayer.dribbling" class="terminal-select"></div>
              <div class="filter-group"><label>Defending</label><input type="number" min="1" max="99" [(ngModel)]="newPlayer.defending" class="terminal-select"></div>
              <div class="filter-group"><label>Physical</label><input type="number" min="1" max="99" [(ngModel)]="newPlayer.physical" class="terminal-select"></div>
            </div>
            <button class="btn-filter" (click)="submitNewPlayer()" style="margin-top: 20px; width: 100%; background-color: #00d4ff; color: #0d1b2a;">GUARDAR EN BASE DE DATOS</button> </div>
        }

        <div class="filter-bar">
          <div class="filter-group"><label>Nombre:</label><input type="text" [(ngModel)]="filters.name" class="terminal-select"></div>
          <div class="filter-group"><label>Club:</label><select [(ngModel)]="filters.club" class="terminal-select"><option value="">Todos</option>@for (club of clubs; track club) { <option [value]="club">{{ club }}</option> }</select></div>
          <div class="filter-group"><label>Nación:</label><select [(ngModel)]="filters.country" class="terminal-select"><option value="">Todas</option>@for (country of countries; track country) { <option [value]="country">{{ country }}</option> }</select></div>
          <div class="filter-group"><label>Edición:</label><select [(ngModel)]="filters.year" class="terminal-select"><option value="">Todas</option>@for (version of versions; track version) { <option [value]="version">FIFA {{ version }}</option> }</select></div>
          <button class="btn-filter" (click)="applyFilters()">Ejecutar Query</button>
        </div>

        <div class="grid">
          @for (player of players; track player.id) {
          <div (click)="openPlayerDetails(player.id)" style="cursor: pointer; transition: 0.3s; border-radius: 8px;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 20px rgba(0, 212, 255, 0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">              <app-player-card [player]="player"></app-player-card>
            </div>
          }
        </div>
      </main>

      @if (selectedPlayer) {
        <div class="modal-overlay" (click)="closeDetails()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <button class="btn-close" (click)="closeDetails()">X</button>
            
            @if (!isEditing) {
              <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px;">
                <img [src]="selectedPlayer.player_face_url" width="80" style="border-radius: 50%; border: 2px solid #00d4ff;">
                <div>
                  <h2 style="margin: 0; color: #00d4ff;">{{ selectedPlayer.long_name }}</h2>
                  <p style="margin: 5px 0; color: #8d99ae;">{{ selectedPlayer.club_name }} | {{ selectedPlayer.nationality_name }} | OVR: {{ selectedPlayer.overall }}</p>
                  <button class="btn-filter" style="margin-top: 10px; padding: 5px 15px;" (click)="startEdit()">Editar Jugador</button>
                </div>
              </div>
              <div style="width: 100%; max-width: 400px; margin: 0 auto;">
                <canvas id="radarChart"></canvas>
              </div>
            } @else {
              <h3 style="color: #00d4ff; margin-top: 0; margin-bottom: 15px;">EDITAR JUGADOR</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
                
                <div style="grid-column: 1 / -1; border-bottom: 1px solid #415a77; padding-bottom: 5px; color: #8d99ae; font-size: 14px;">DATOS DEL PERFIL</div>
                
                <div class="filter-group"><label>Nombre</label><input [(ngModel)]="editPlayer.long_name" class="terminal-select"></div>
                <div class="filter-group"><label>Posición</label><input [(ngModel)]="editPlayer.player_positions" class="terminal-select"></div>
                <div class="filter-group"><label>Club</label><input [(ngModel)]="editPlayer.club_name" class="terminal-select"></div>
                <div class="filter-group"><label>Nación</label><input [(ngModel)]="editPlayer.nationality_name" class="terminal-select"></div>
                
                <div style="grid-column: 1 / -1; border-bottom: 1px solid #415a77; padding-bottom: 5px; color: #8d99ae; font-size: 14px; margin-top: 10px;">MÉTRICAS TÉCNICAS</div>
                
                <div class="filter-group"><label>Overall</label><input type="number" [(ngModel)]="editPlayer.overall" class="terminal-select"></div>
                <div class="filter-group"><label>Pace</label><input type="number" [(ngModel)]="editPlayer.pace" class="terminal-select"></div>
                <div class="filter-group"><label>Shooting</label><input type="number" [(ngModel)]="editPlayer.shooting" class="terminal-select"></div>
                <div class="filter-group"><label>Passing</label><input type="number" [(ngModel)]="editPlayer.passing" class="terminal-select"></div>
                <div class="filter-group"><label>Dribbling</label><input type="number" [(ngModel)]="editPlayer.dribbling" class="terminal-select"></div>
                <div class="filter-group"><label>Defending</label><input type="number" [(ngModel)]="editPlayer.defending" class="terminal-select"></div>
                <div class="filter-group"><label>Physical</label><input type="number" [(ngModel)]="editPlayer.physic" class="terminal-select"></div>
              </div>
              <div style="display: flex; gap: 10px;">
                <button class="btn-filter" style="flex: 1;" (click)="saveEdit()">Guardar Cambios</button>
                <button class="btn-filter" style="flex: 1; background-color: #415a77;" (click)="cancelEdit()">Cancelar</button>
              </div>
            }
          </div>
        </div>
      }
    }`,
  styles: [`
    .login-fullscreen { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #0d1b2a; display: flex; justify-content: center; align-items: center; z-index: 9999; }
    .login-box { display: flex; flex-direction: column; gap: 10px; background: #1b263b; padding: 40px; border-radius: 8px; border: 1px solid #415a77; width: 320px; text-align: center; }
    .dashboard { padding: 40px; background-color: #0d1b2a; min-height: 100vh; color: white; font-family: monospace; }
    h1 { font-family: 'Oswald', sans-serif; text-transform: uppercase; border-bottom: 2px solid #ff4655; display: inline-block; margin-bottom: 0; }
    .filter-bar { display: flex; gap: 20px; margin-bottom: 30px; background: #1b263b; padding: 15px; border-radius: 8px; border: 1px solid #415a77; align-items: flex-end; flex-wrap: wrap; }
    .filter-group { display: flex; flex-direction: column; gap: 5px; }
    .filter-group label { color: #8d99ae; font-size: 12px; text-transform: uppercase; }
    .terminal-select { background-color: #0d1b2a; color: #00d4ff; border: 1px solid #415a77; padding: 8px; border-radius: 4px; font-family: monospace; outline: none; cursor: pointer; min-width: 150px; }
    .btn-filter { background-color: #ff4655; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; text-transform: uppercase; transition: 0.3s; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(13, 27, 42, 0.8); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(5px); }
    .modal-content { background: #1b263b; padding: 30px; border-radius: 10px; border: 1px solid #ff4655; width: 90%; max-width: 500px; position: relative; font-family: monospace; }
    .btn-close { position: absolute; top: 15px; right: 15px; background: transparent; color: #ff4655; border: none; font-size: 20px; font-weight: bold; cursor: pointer; }
    /* Scrollbar Personalizado */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #0d1b2a; }
    ::-webkit-scrollbar-thumb { background: #415a77; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #00d4ff; }
    .loading-text { 
      color: #00d4ff; 
      grid-column: 1 / -1; 
      font-family: monospace;
      animation: blink 1.5s infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `]
})
export class AppComponent implements OnInit {
  private playerService = inject(PlayerService);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  
  isAuthenticated = false;
  creds = { username: '', password: '' };
  players: any[] = []; 
  countries: string[] = []; 
  clubs: string[] = []; 
  versions: string[] = [];
  filters = { name: '', club: '', country: '', year: '', gender: '' };
  showCreateForm = false;
  
  selectedPlayer: any = null;
  chartInstance: any = null;
  isEditing = false;
  editPlayer: any = {};

  newPlayer = { name: '', country: '', club: '', year: '', gender: 'M', overall: 80, pace: 80, shooting: 80, passing: 80, dribbling: 80, defending: 80, physical: 80 };

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token && token !== 'undefined' && token.length > 20) {
        setTimeout(() => this.isAuthenticated = true);
        this.loadDynamicLists(); 
        this.applyFilters();
      } else { 
        localStorage.removeItem('token'); 
      }
    }
  }

  login() {
    this.http.post<any>('http://localhost:3000/api/auth/login', this.creds).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.isAuthenticated = true; 
        this.loadDynamicLists();    
        this.applyFilters();         
      },
      error: () => alert('Usuario o contraseña incorrectos')
    });
  }

  register() {
    if (!this.creds.username || !this.creds.password) { 
      alert('Ingresa usuario y contraseña válidos.'); 
      return; 
    }
    this.http.post<any>('http://localhost:3000/api/auth/register', this.creds).subscribe({
      next: (res) => alert(res.message),
      error: (err) => alert(err.error?.message || 'Error al registrar')
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    this.players = []; 
  }

  toggleCreateForm() { 
    this.showCreateForm = !this.showCreateForm; 
  }

  submitNewPlayer() {
    if (!this.newPlayer.name || !this.newPlayer.country || !this.newPlayer.club) {
      alert('El nombre, la nación y el club son obligatorios'); 
      return;
    }
    if (this.newPlayer.overall > 99 || this.newPlayer.pace > 99) {
      alert('Las estadísticas no pueden superar 99'); 
      return;
    }

    const playerPayload = {
      long_name: this.newPlayer.name,             
      nationality_name: this.newPlayer.country,   
      club_name: this.newPlayer.club, 
      overall: this.newPlayer.overall,
      pace: this.newPlayer.pace,
      shooting: this.newPlayer.shooting,
      passing: this.newPlayer.passing,
      dribbling: this.newPlayer.dribbling, 
      defending: this.newPlayer.defending,
      physic: this.newPlayer.physical,
      gender: this.newPlayer.gender,
      fifa_version: this.newPlayer.year,          
      player_positions: 'CM',                     
      player_face_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' 
    };

    this.playerService.createPlayer(playerPayload).subscribe({
      next: () => {
        alert('¡Jugador creado exitosamente!');
        this.toggleCreateForm(); 
        this.applyFilters(); 
        this.newPlayer = { name: '', country: '', club: '', year: '', gender: 'M', overall: 80, pace: 80, shooting: 80, passing: 80, dribbling: 80, defending: 80, physical: 80 };
      },
      error: () => alert('Error al crear el jugador')
    });
  }

  loadDynamicLists() {
    this.playerService.getNationalities().subscribe(data => this.countries = data.nationalities);
    this.playerService.getClubs().subscribe(data => this.clubs = data.clubs);
    this.playerService.getVersions().subscribe(data => this.versions = data.versions);
  }

  applyFilters() {
    this.playerService.getPlayers(this.filters).subscribe({
      next: (data) => this.players = data.players,
      error: (err) => console.error(err)
    });
  }

  openPlayerDetails(id: number) {
    this.playerService.getPlayerById(id).subscribe({
      next: (res) => {
        this.selectedPlayer = res.player;
        setTimeout(() => this.renderRadarChart(), 100);
      },
      error: () => alert('Error al cargar detalles del jugador')
    });
  }

  startEdit() {
    this.isEditing = true;
    this.editPlayer = { ...this.selectedPlayer };
  }

  saveEdit() {
    const payload = {
      long_name: this.editPlayer.long_name,
      nationality_name: this.editPlayer.nationality_name,
      club_name: this.editPlayer.club_name,
      player_positions: this.editPlayer.player_positions,
      overall: this.editPlayer.overall,
      pace: this.editPlayer.pace,
      shooting: this.editPlayer.shooting,
      passing: this.editPlayer.passing,
      dribbling: this.editPlayer.dribbling,
      defending: this.editPlayer.defending,
      physic: this.editPlayer.physic
    };

    this.playerService.updatePlayer(this.selectedPlayer.id, payload).subscribe({
      next: () => {
        alert('¡Jugador actualizado exitosamente!');
        this.isEditing = false;
        this.closeDetails();
        this.applyFilters(); 
      },
      error: () => alert('Error al actualizar el jugador')
    });
  }

  cancelEdit() {
    this.isEditing = false;
    this.closeDetails();
    this.openPlayerDetails(this.selectedPlayer.id);
  }

  closeDetails() {
    this.selectedPlayer = null;
    this.isEditing = false;
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  renderRadarChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    
    const canvas = document.getElementById('radarChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.chartInstance = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: ['Pace', 'Shooting', 'Passing', 'Dribbling', 'Defending', 'Physic'],
        datasets: [{
          label: 'Estadísticas del Jugador',
          data: [
            this.selectedPlayer.pace,
            this.selectedPlayer.shooting,
            this.selectedPlayer.passing,
            this.selectedPlayer.dribbling,
            this.selectedPlayer.defending,
            this.selectedPlayer.physic
          ],
          backgroundColor: 'rgba(0, 212, 255, 0.2)',
          borderColor: '#00d4ff',
          pointBackgroundColor: '#ff4655',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#ff4655'
        }]
      },
      options: {
        scales: {
          r: {
            min: 0,
            max: 100,
            angleLines: { color: 'rgba(141, 153, 174, 0.3)' },
            grid: { color: 'rgba(141, 153, 174, 0.3)' },
            pointLabels: { color: '#00d4ff', font: { family: 'monospace', size: 12 } },
            ticks: { display: false }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}