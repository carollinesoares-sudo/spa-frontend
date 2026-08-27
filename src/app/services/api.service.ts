import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3005/api';

  constructor(private http: HttpClient) { }

  // Auth
  login(dados: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, dados);
  }

  // Clientes
  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/clientes`);
  }

  criarCliente(cliente: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/clientes`, cliente);
  }

  atualizarCliente(id: number, cliente: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/clientes/${id}`, cliente);
  }

  excluirCliente(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clientes/${id}`);
  }

  // Salas (Recursos)
  getSalas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/salas`);
  }

  // Agendamentos
  getAgendamentos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/agendamentos`);
  }

  criarAgendamento(agendamento: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/agendamentos`, agendamento);
  }
}
