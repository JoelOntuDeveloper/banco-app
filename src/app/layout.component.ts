import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, RouterOutlet],
    template: `
    <div class="app-root">
      <header class="app-header">
        <div class="brand">
          <div class="title">BANCO</div>
        </div>
      </header>

      <div class="app-body">
        <nav class="sidebar">
          <ul>
            <li><a routerLink="/clientes">Clientes</a></li>
            <li><a routerLink="/cuentas">Cuentas</a></li>
            <li><a routerLink="/movimientos">Movimientos</a></li>
            <li><a routerLink="/reportes">Reportes</a></li>
          </ul>
        </nav>

        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
    styles: [
        `
      :host { display: block; height: 100vh; }
      .app-header { height: 60px; display:flex; align-items:center; justify-content:center; border-bottom:1px solid #e7e7e7; background:#fff; }
      .brand { display:flex; gap:8px; align-items:center; }
      .logo{ font-size:20px }
      .title{ font-weight:700; letter-spacing:1px }
      .app-body{ display:flex; height: calc(100% - 60px); }
      .sidebar{ width:200px; border-right:1px solid #eee; padding:20px; background:#fafafa }
      .sidebar ul{ list-style:none; padding:0; margin:0 }
      .sidebar a{ text-decoration:none; color:#333; display:block; padding:10px 6px; border-radius:4px }
      .sidebar a:hover{ background: #fff3b0 }
      .content{ flex:1; padding:24px; background:#fff }
    `
    ]
})
export class LayoutComponent { }
