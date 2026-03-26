const request = require('supertest');
const app = require('../src/app');
const { clearTasks } = require('../src/taskService');

beforeEach(() => {
  clearTasks();
});

// ─── Health check ─────────────────────────────────────────────────────────────

describe('GET /health', () => {
  test('retorna status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

// ─── POST /tasks ──────────────────────────────────────────────────────────────

describe('POST /tasks', () => {
  test('crea una tarea con datos válidos → 201', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Tarea de integración', priority: 'high' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.title).toBe('Tarea de integración');
    expect(res.body.data.priority).toBe('high');
  });

  test('rechaza tarea sin title → 400', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  test('rechaza priority inválida → 400', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Tarea', priority: 'urgentísima' });
    expect(res.status).toBe(400);
  });
});

// ─── GET /tasks ───────────────────────────────────────────────────────────────

describe('GET /tasks', () => {
  test('retorna lista vacía inicialmente', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.total).toBe(0);
  });

  test('retorna tareas creadas', async () => {
    await request(app).post('/tasks').send({ title: 'T1' });
    await request(app).post('/tasks').send({ title: 'T2' });

    const res = await request(app).get('/tasks');
    expect(res.body.total).toBe(2);
  });

  test('filtra por status via query param', async () => {
    await request(app).post('/tasks').send({ title: 'Pendiente', status: 'pending' });
    await request(app).post('/tasks').send({ title: 'Hecha', status: 'done' });

    const res = await request(app).get('/tasks?status=done');
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].title).toBe('Hecha');
  });
});

// ─── GET /tasks/:id ───────────────────────────────────────────────────────────

describe('GET /tasks/:id', () => {
  test('retorna la tarea correcta', async () => {
    const created = await request(app)
      .post('/tasks')
      .send({ title: 'Buscar esta' });
    const id = created.body.data.id;

    const res = await request(app).get(`/tasks/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
  });

  test('retorna 404 para ID inexistente', async () => {
    const res = await request(app).get('/tasks/id-falso-xyz');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ─── PUT /tasks/:id ───────────────────────────────────────────────────────────

describe('PUT /tasks/:id', () => {
  test('actualiza una tarea existente', async () => {
    const created = await request(app)
      .post('/tasks')
      .send({ title: 'Original' });
    const id = created.body.data.id;

    const res = await request(app)
      .put(`/tasks/${id}`)
      .send({ title: 'Actualizado', status: 'done' });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Actualizado');
    expect(res.body.data.status).toBe('done');
  });

  test('retorna 404 para ID inexistente', async () => {
    const res = await request(app)
      .put('/tasks/no-existe')
      .send({ title: 'X' });
    expect(res.status).toBe(404);
  });
});

// ─── DELETE /tasks/:id ────────────────────────────────────────────────────────

describe('DELETE /tasks/:id', () => {
  test('elimina una tarea existente → 200', async () => {
    const created = await request(app)
      .post('/tasks')
      .send({ title: 'Eliminar esta' });
    const id = created.body.data.id;

    const res = await request(app).delete(`/tasks/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verificar que ya no existe
    const check = await request(app).get(`/tasks/${id}`);
    expect(check.status).toBe(404);
  });

  test('retorna 404 al intentar eliminar ID inexistente', async () => {
    const res = await request(app).delete('/tasks/no-existe');
    expect(res.status).toBe(404);
  });
});

// ─── GET /tasks/stats ─────────────────────────────────────────────────────────

describe('GET /tasks/stats', () => {
  test('retorna estadísticas agregadas', async () => {
    await request(app).post('/tasks').send({ title: 'T1', priority: 'high', status: 'done' });
    await request(app).post('/tasks').send({ title: 'T2', priority: 'low' });

    const res = await request(app).get('/tasks/stats');
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(2);
    expect(res.body.data.byStatus).toBeDefined();
    expect(res.body.data.byPriority).toBeDefined();
  });
});

// ─── 404 catch-all ───────────────────────────────────────────────────────────

describe('Rutas inexistentes', () => {
  test('retorna 404 para rutas no definidas', async () => {
    const res = await request(app).get('/ruta-que-no-existe');
    expect(res.status).toBe(404);
  });
});
