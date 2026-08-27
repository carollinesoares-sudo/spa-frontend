import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './agendamentos.component.html',
  styleUrl: './agendamentos.component.css'
})
export class AgendamentosComponent implements OnInit {
  agendamentos: any[] = [];
  clientes: any[] = [];
  salas: any[] = [];
  procedimentosDisponiveis: string[] = [];

  // Mapeamento Estrito: Procedimentos por tipo de Sala
  private mapaProcedimentos: { [key: string]: string[] } = {
    'Facial': ['Limpeza de Pele Profunda', 'Peeling de Diamante', 'Hidratação Facial Premium'],
    'Massagem Spa': ['Massagem Relaxante', 'Massagem Modeladora', 'Drenagem Linfática'],
    'Laser A': ['Depilação a Laser Alexandrite', 'Fotorrejuvenescimento Facial'],
    'Laser B': ['Depilação a Laser Diódo', 'Tratamento de Hiperpimentação'],
    'Corporal Advanced': ['Criolipólise', 'Radiofrequência Corporal', 'Eletrostimulação']
  };

  agendamentoForm: any = {
    cliente_id: '',
    sala_id: '',
    data_agendamento: '',
    hora_agendamento: '',
    procedimento: ''
  };

  mensagem: string = '';
  erroMensagem: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.apiService.getAgendamentos().subscribe({
      next: (dados) => this.agendamentos = dados,
      error: () => this.exibirErro('Erro ao carregar lista de agendamentos.')
    });

    this.apiService.getClientes().subscribe({
      next: (dados) => this.clientes = dados,
      error: () => this.exibirErro('Erro ao carregar clientes.')
    });

    this.apiService.getSalas().subscribe({
      next: (dados) => this.salas = dados,
      error: () => this.exibirErro('Erro ao carregar salas.')
    });
  }

  // Atualiza a lista de procedimentos ao escolher uma sala
  onSalaChange(): void {
    this.agendamentoForm.procedimento = '';
    const salaSelecionada = this.salas.find(s => s.id == this.agendamentoForm.sala_id);

    if (!salaSelecionada) {
      this.procedimentosDisponiveis = [];
      return;
    }

    const nomeSala = salaSelecionada.nome_sala;
    this.procedimentosDisponiveis = [];

    Object.keys(this.mapaProcedimentos).forEach(chave => {
      if (nomeSala.includes(chave)) {
        this.procedimentosDisponiveis = this.mapaProcedimentos[chave];
      }
    });
  }

  salvarAgendamento(): void {
    const { cliente_id, sala_id, data_agendamento, hora_agendamento, procedimento } = this.agendamentoForm;

    if (!cliente_id || !sala_id || !data_agendamento || !hora_agendamento || !procedimento) {
      this.exibirErro('Preencha todos os campos obrigatórios.');
      return;
    }

    // Trava de Horário no Frontend (08:00 às 17:00)
    if (hora_agendamento < '08:00' || hora_agendamento > '17:00') {
      this.exibirErro('Horário inválido. O horário de funcionamento da clínica é das 08:00 às 17:00.');
      return;
    }

    this.apiService.criarAgendamento(this.agendamentoForm).subscribe({
      next: () => {
        this.exibirSucesso('Agendamento realizado com sucesso!');
        this.carregarDados();
        this.limparFormulario();
      },
      error: (err) => {
        const msg = err.error?.message || 'Erro ao processar agendamento.';
        this.exibirErro(`BLOQUEIO: ${msg}`);
      }
    });
  }

  limparFormulario(): void {
    this.agendamentoForm = { cliente_id: '', sala_id: '', data_agendamento: '', hora_agendamento: '', procedimento: '' };
    this.procedimentosDisponiveis = [];
  }

  exibirSucesso(msg: string): void { this.mensagem = msg; this.erroMensagem = ''; }
  exibirErro(msg: string): void { this.erroMensagem = msg; this.mensagem = ''; }
}
