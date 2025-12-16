# Banco App — Frontend

- **Descripción**: Frontend Angular 21 para la aplicación bancaria (CRUD de Clientes, Cuentas, Movimientos y reportes). Usa componentes standalone, servicios tipados y consumo de una API REST.

**Rutas importantes**
- **API base (backend)**: http://localhost:8081/
- **Frontend (app)**: http://localhost:4200/

**Instalación y ejecución**
- **Requisitos**: Node.js (recomendado >=18)
- Instalar dependencias:

```bash
npm install
```

- Abrir la UI luego de levantar el proyecto: http://localhost:4200/

**Configuración de la API**
- Archivo de configuración: [src/environments/environment.ts](src/environments/environment.ts)
- Valor por defecto `apiUrl` apunta a `http://localhost:8081/api`.

**Endpoints relevantes (resumen)**
- Clientes: `GET/POST/PUT/DELETE` en `${apiUrl}/clientes` — servicio: [src/app/services/clientes.service.ts](src/app/services/clientes.service.ts)
- Cuentas: `GET/POST/PATCH/DELETE` en `${apiUrl}/cuentas` — servicio: [src/app/services/cuentas.service.ts](src/app/services/cuentas.service.ts)
- Movimientos: `GET/POST` en `${apiUrl}/movimientos` — servicio: [src/app/services/movimientos.service.ts](src/app/services/movimientos.service.ts)
- Reportes: `GET ${apiUrl}/reportes/{clienteId}?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD` y `GET ${apiUrl}/reportes/{clienteId}/pdf?...` — servicio: [src/app/services/reportes.service.ts](src/app/services/reportes.service.ts)

**Arquitectura y ubicación de código**
- Rutas y layout: [src/app/app.routes.ts](src/app/app.routes.ts), [src/app/layout.component.ts](src/app/layout.component.ts)
- Páginas (CRUD / reportes): [src/app/pages](src/app/pages)
- Servicios (API): [src/app/services](src/app/services)
- Modelos/DTOs: [src/app/models](src/app/models)

**Pruebas unitarias**
- Ejecutar tests:

- Se han agregado tests para los servicios HTTP en:
  - [src/app/services/clientes.service.spec.ts](src/app/services/clientes.service.spec.ts)
  - [src/app/services/cuentas.service.spec.ts](src/app/services/cuentas.service.spec.ts)
  - [src/app/services/movimientos.service.spec.ts](src/app/services/movimientos.service.spec.ts)
  - [src/app/services/reportes.service.spec.ts](src/app/services/reportes.service.spec.ts)

**Repositorio backend**
- Código del backend (API): https://github.com/JoelOntuDeveloper/ms-banco

## Docker — Despliegue en contenedores

### Requisitos
- Docker y Docker Compose
- Backend levantado en http://localhost:8081

### Levantar la aplicación

```bash
docker-compose up -d --build
```

Acceder a: http://localhost:4200

Detener:

```bash
docker-compose down
```

### Configuración de nginx

El archivo [nginx.conf](nginx.conf) configura:
- Servicio de archivos estáticos (JS, CSS, imágenes) con caché
- Fallback a `index.html` para el enrutamiento SPA
- Proxy a la API: `/api/*` → `http://localhost:8081/api/*`