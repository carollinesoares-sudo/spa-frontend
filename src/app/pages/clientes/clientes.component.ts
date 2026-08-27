import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  filtro: string = '';

  clienteForm: any = { id: null, nome: '', cpf: '', telefone: '', email: '' };
  isEditando: boolean = false;
  mensagem: string = '';
  erroMensagem: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.apiService.getClientes().subscribe({
      next: (dados) => {
        this.clientes = dados;
        this.aplicarFiltro();
      },
      error: () => this.exibirErro('Erro ao carregar lista de clientes.')
    });
  }

  aplicarFiltro(): void {
    const termo = this.filtro.toLowerCase().trim();
    if (!termo) {
      this.clientesFiltrados = [...this.clientes];
    } else {
      this.clientesFiltrados = this.clientes.filter(c =>
        c.nome.toLowerCase().includes(termo) || c.cpf.includes(termo)
      );
    }
  }

  salvarCliente(): void {
    if (!this.clienteForm.nome || !this.clienteForm.cpf || !this.clienteForm.telefone || !this.clienteForm.email) {
      this.exibirErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (this.isEditando) {
      this.apiService.atualizarCliente(this.clienteForm.id, this.clienteForm).subscribe({
        next: () => {
          this.exibirSucesso('Cliente atualizado com sucesso!');
          this.limparFormulario();
          this.carregarClientes();
        },
        error: (err) => this.exibirErro(err.error?.error || 'Erro ao atualizar cliente.')
      });
    } else {
      this.apiService.criarCliente(this.clienteForm).subscribe({
        next: () => {
          this.exibirSucesso('Cliente cadastrado com sucesso!');
          this.limparFormulario();
          this.carregarClientes();
        },
        error: (err) => this.exibirErro(err.error?.error || 'Erro ao cadastrar cliente.')
      });
    }
  }

  prepararEdicao(cliente: any): void {
    this.clienteForm = { ...cliente };
    this.isEditando = true;
    this.limparAlertas();
  }

  excluirCliente(id: number): void {
    if (confirm('Deseja realmente excluir este cliente?')) {
      this.apiService.excluirCliente(id).subscribe({
        next: () => {
          this.exibirSucesso('Cliente removido com sucesso!');
          this.carregarClientes();
        },
        error: () => this.exibirErro('Não foi possível excluir o cliente.')
      });
    }
  }

  limparFormulario(): void {
    this.clienteForm = { id: null, nome: '', cpf: '', telefone: '', email: '' };
    this.isEditando = false;
  }

  exibirSucesso(msg: string): void {
    this.mensagem = msg;
    this.erroMensagem = '';
  }

  exibirErro(msg: string): void {
    this.erroMensagem = msg;
    this.mensagem = '';
  }

  limparAlertas(): void {
    this.mensagem = '';
    this.erroMensagem = '';
  }
}
