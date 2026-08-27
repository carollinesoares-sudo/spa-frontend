import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  usuario: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userStorage = localStorage.getItem('usuario');
    if (userStorage) {
      this.usuario = JSON.parse(userStorage);
    }
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
