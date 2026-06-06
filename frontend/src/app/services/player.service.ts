import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private apiUrl = 'http://localhost:3000/api/players';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getPlayers(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    if (filters.country) params = params.set('country', filters.country);
    if (filters.year) params = params.set('year', filters.year);
    if (filters.gender) params = params.set('gender', filters.gender);
    // 🟢 ENVIAMOS EL NOMBRE Y EL CLUB PARA FILTRAR
    if (filters.name) params = params.set('name', filters.name);
    if (filters.club) params = params.set('club', filters.club);

    return this.http.get<any>(this.apiUrl, { params, headers: this.getHeaders() });
  }

  createPlayer(playerData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, playerData, { headers: this.getHeaders() });
  }

  getNationalities(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/nationalities`, { headers: this.getHeaders() });
  }

  getClubs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clubs`, { headers: this.getHeaders() });
  }

  getVersions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/versions`, { headers: this.getHeaders() });
  }
  getPlayerById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  updatePlayer(id: number, playerData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, playerData, { headers: this.getHeaders() });
  }
}