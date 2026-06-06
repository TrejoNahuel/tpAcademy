import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header">
        <img [src]="player?.player_face_url" 
             [alt]="player?.long_name" 
             class="player-img"
             referrerpolicy="no-referrer"
             (error)="onImageError($event)">
             
        <div class="header-info">
          <h3>{{ player?.long_name }}</h3>
          <span class="badge">{{ player?.overall }}</span>
        </div>
      </div>
      
      <div class="card-body">
        <p><strong>Club:</strong> {{ player?.club_name }}</p>
        <p><strong>Nación:</strong> {{ player?.nationality_name }}</p>
        <label>Potencial / Overall</label>
        <progress [value]="player?.overall" max="100"></progress>
      </div>
    </div>
  `,
  styleUrls: ['./player-card.component.css']
})
export class PlayerCardComponent {
  @Input() player: any; 

  // Esta función reemplaza la imagen rota por una genérica
  onImageError(event: any) {
    event.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
  }
}