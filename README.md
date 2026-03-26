# TaskAPI 🗂️

REST API de gestión de tareas construida con **Node.js + Express.js**, con pipeline CI/CD completo usando **GitHub Actions**, cobertura de código con **Istanbul/Jest** y análisis estático con **SonarCloud**.

[![CI Pipeline](https://github.com/TU_USUARIO/taskapi/actions/workflows/ci.yml/badge.svg)](https://github.com/TU_USUARIO/taskapi/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-98.91%25-brightgreen)](./coverage/lcov-report/index.html)
[![ESLint](https://img.shields.io/badge/lint-ESLint-4B32C3)](./eslintrc.json)

---

## 📁 Estructura del proyecto

```
taskapi/
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline CI/CD (6 stages)
├── src/
│   ├── app.js                  # Servidor Express + middlewares
│   ├── taskRouter.js           # Rutas REST /tasks
│   └── taskService.js          # Lógica de negocio
├── tests/
│   ├── taskService.test.js     # 20 pruebas unitarias (incl. TDD)
│   └── api.integration.test.js # 14 pruebas de integración
├── coverage/
│   └── lcov-report/
│       └── index.html          # Reporte HTML de cobertura
├── .eslintrc.json              # Configuración ESLint
├── sonar-project.properties    # Configuración SonarCloud
├── CI_REPORT.md                # Documentación del pipeline
└── package.json
```

---

## 🚀 Instalación y uso local

```bash
# 1. Clonar repositorio
git clone https://github.com/TU_USUARIO/taskapi.git
cd taskapi

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor (puerto 3000)
npm start

# 4. Ejecutar tests
npm test

# 5. Tests con reporte de cobertura
npm run test:coverage

# 6. Lint
npm run lint
```

---

## 🔌 Endpoints de la API

| Método   | Endpoint        | Descripción                              |
|:--------:|-----------------|------------------------------------------|
| `GET`    | `/health`       | Health check del servidor                |
| `GET`    | `/tasks`        | Listar tareas (`?status=` `?priority=`)  |
| `GET`    | `/tasks/stats`  | Estadísticas agregadas                   |
| `GET`    | `/tasks/:id`    | Obtener tarea por ID                     |
| `POST`   | `/tasks`        | Crear nueva tarea                        |
| `PUT`    | `/tasks/:id`    | Actualizar tarea existente               |
| `DELETE` | `/tasks/:id`    | Eliminar tarea                           |

### Ejemplo — Crear tarea

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Estudiar CI/CD", "priority": "high", "status": "pending"}'
```

```json
{
  "success": true,
  "data": {
    "id": "uuid-generado",
    "title": "Estudiar CI/CD",
    "priority": "high",
    "status": "pending",
    "createdAt": "2026-03-25T00:00:00.000Z",
    "updatedAt": "2026-03-25T00:00:00.000Z"
  }
}
```

### Campos válidos

| Campo         | Tipo     | Valores aceptados                  | Default    |
|---------------|----------|------------------------------------|------------|
| `title`       | string   | Máx. 200 caracteres (requerido)    | —          |
| `description` | string   | Texto libre                        | `""`       |
| `priority`    | string   | `low` \| `medium` \| `high`        | `"medium"` |
| `status`      | string   | `pending` \| `in_progress` \| `done` | `"pending"` |

---

## 🧪 Suite de tests

### Resultados

```
Test Suites: 2 passed
Tests:       40 passed, 0 failed
Coverage:    98.91% statements | 94.44% branches | 100% functions
```

### Distribución

| Archivo                       | Tipo         | Tests |
|-------------------------------|:------------:|:-----:|
| `taskService.test.js`         | Unitario     | 20    |
| `api.integration.test.js`     | Integración  | 14+   |
| **Total**                     |              | **40**|

### TDD aplicado

Las funciones `createTask()` y `updateTask()` fueron desarrolladas con **Test-Driven Development** estricto:

```
🔴 RED    → Escribir test (función no existe → falla)
🟢 GREEN  → Código mínimo para pasar el test
🔵 REFACTOR → Limpiar sin romper tests
```

---

## ⚙️ Pipeline CI/CD

El pipeline corre automáticamente en cada `push` a `main`/`develop` y en cada Pull Request.

```
Push → Install → Lint → Test → Coverage → Build → Deploy*
                  ↕         ↕
              (paralelo) (paralelo)
```

*Deploy solo en rama `main`

### Stages

| Stage      | Herramienta        | Descripción                          |
|:----------:|-------------------|--------------------------------------|
| Install    | npm ci            | Instala dependencias con lockfile    |
| Lint       | ESLint            | Verifica estándares de código        |
| Test       | Jest + Supertest  | Corre unit + integration tests       |
| Coverage   | Istanbul/c8       | Genera reporte HTML + lcov.info      |
| Build      | —                 | Verifica artefactos listos           |
| Deploy     | Render            | Deploy automático (solo main)        |

---

## 📊 Métricas de calidad

| Métrica         | Umbral | Valor actual |
|-----------------|:------:|:------------:|
| Statements      | ≥ 80%  | **98.91%**   |
| Branches        | ≥ 80%  | **94.44%**   |
| Functions       | ≥ 80%  | **100%**     |
| Lines           | ≥ 80%  | **98.79%**   |
| ESLint errors   | 0      | **0**        |
| ESLint warnings | 0      | **0**        |

---

## ☁️ SonarCloud

Análisis estático configurado. Para activarlo:

1. Crear cuenta gratuita en [sonarcloud.io](https://sonarcloud.io) con GitHub
2. Importar el repositorio
3. Copiar el token: **My Account → Security → Generate Token**
4. En GitHub: **Settings → Secrets → `SONAR_TOKEN`**
5. Actualizar `sonar-project.properties` con tu organización y project key

---

## 📄 Documentación adicional

- [`CI_REPORT.md`](./CI_REPORT.md) — Diagrama del pipeline, métricas detalladas, justificación de thresholds
- [`coverage/lcov-report/index.html`](./coverage/lcov-report/index.html) — Reporte interactivo de cobertura
