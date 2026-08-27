import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  senha = '';
  erroMensagem = '';

  constructor(private apiService: ApiService, private router: Router) {}

  realizarLogin(): void {
    if (!this.email || !this.senha) {
      this.erroMensagem = 'Preencha todos os campos obrigatórios.';
      return;
    }

    this.apiService.login({ email: this.email, senha: this.senha }).subscribe({
      next: (res) => {
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this.router.navigate(['/agendamentos']);
      },
      error: (err) => {
        this.erroMensagem = err.error?.message || 'Falha ao autenticar. Tente novamente.';
      }
    });
  }
}
