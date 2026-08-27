import {Routes} from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { AgendamentosComponent } from './pages/agendamentos/agendamentos.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'agendamentos', component: AgendamentosComponent },
  { path: '**', redirectTo: '' }
];
