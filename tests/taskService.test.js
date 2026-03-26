const {
  validateTask,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getStats,
  clearTasks,
} = require('../src/taskService');

beforeEach(() => {
  clearTasks();
});

// ─── validateTask ────────────────────────────────────────────────────────────

describe('validateTask()', () => {
  test('retorna válido con datos mínimos correctos', () => {
    const { valid, errors } = validateTask({ title: 'Mi tarea' });
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  test('retorna error cuando title está vacío', () => {
    const { valid, errors } = validateTask({ title: '' });
    expect(valid).toBe(false);
    expect(errors[0]).toMatch(/title/);
  });

  test('retorna error cuando title supera 200 caracteres', () => {
    const { valid, errors } = validateTask({ title: 'a'.repeat(201) });
    expect(valid).toBe(false);
    expect(errors[0]).toMatch(/200/);
  });

  test('retorna error con priority inválida', () => {
    const { valid, errors } = validateTask({ title: 'Tarea', priority: 'urgente' });
    expect(valid).toBe(false);
    expect(errors[0]).toMatch(/priority/);
  });

  test('retorna error con status inválido', () => {
    const { valid, errors } = validateTask({ title: 'Tarea', status: 'completed' });
    expect(valid).toBe(false);
    expect(errors[0]).toMatch(/status/);
  });

  test('acepta priority válida (high)', () => {
    const { valid } = validateTask({ title: 'Tarea', priority: 'high' });
    expect(valid).toBe(true);
  });

  test('acepta status válido (in_progress)', () => {
    const { valid } = validateTask({ title: 'Tarea', status: 'in_progress' });
    expect(valid).toBe(true);
  });
});

// ─── createTask (TDD: tests escritos antes del código) ───────────────────────

describe('createTask() — TDD', () => {
  test('crea una tarea con valores por defecto', () => {
    const { task } = createTask({ title: 'Nueva tarea' });
    expect(task).toBeDefined();
    expect(task.id).toBeDefined();
    expect(task.title).toBe('Nueva tarea');
    expect(task.status).toBe('pending');
    expect(task.priority).toBe('medium');
    expect(task.createdAt).toBeDefined();
  });

  test('crea tarea con todos los campos personalizados', () => {
    const { task } = createTask({
      title: 'Tarea completa',
      description: 'Desc detallada',
      priority: 'high',
      status: 'in_progress',
    });
    expect(task.priority).toBe('high');
    expect(task.status).toBe('in_progress');
    expect(task.description).toBe('Desc detallada');
  });

  test('retorna errors cuando title falta', () => {
    const { task, errors } = createTask({});
    expect(task).toBeUndefined();
    expect(errors).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
  });

  test('recorta espacios en title', () => {
    const { task } = createTask({ title: '  Tarea con espacios  ' });
    expect(task.title).toBe('Tarea con espacios');
  });
});

// ─── getAllTasks ──────────────────────────────────────────────────────────────

describe('getAllTasks()', () => {
  test('retorna array vacío cuando no hay tareas', () => {
    expect(getAllTasks()).toEqual([]);
  });

  test('retorna todas las tareas', () => {
    createTask({ title: 'T1' });
    createTask({ title: 'T2' });
    expect(getAllTasks()).toHaveLength(2);
  });

  test('filtra por status', () => {
    createTask({ title: 'T1', status: 'pending' });
    createTask({ title: 'T2', status: 'done' });
    const result = getAllTasks({ status: 'done' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('T2');
  });

  test('filtra por priority', () => {
    createTask({ title: 'T1', priority: 'low' });
    createTask({ title: 'T2', priority: 'high' });
    const result = getAllTasks({ priority: 'high' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('T2');
  });
});

// ─── getTaskById ─────────────────────────────────────────────────────────────

describe('getTaskById()', () => {
  test('retorna la tarea correcta por ID', () => {
    const { task } = createTask({ title: 'Buscar esta' });
    const found = getTaskById(task.id);
    expect(found).not.toBeNull();
    expect(found.id).toBe(task.id);
  });

  test('retorna null para ID inexistente', () => {
    expect(getTaskById('id-falso-123')).toBeNull();
  });
});

// ─── updateTask (TDD: tests escritos antes del código) ───────────────────────

describe('updateTask() — TDD', () => {
  test('actualiza el título correctamente', () => {
    const { task } = createTask({ title: 'Original' });
    const { task: updated } = updateTask(task.id, { title: 'Actualizado' });
    expect(updated.title).toBe('Actualizado');
  });

  test('retorna notFound para ID inexistente', () => {
    const { notFound } = updateTask('no-existe', { title: 'X' });
    expect(notFound).toBe(true);
  });

  test('retorna errors con datos inválidos', () => {
    const { task } = createTask({ title: 'Tarea' });
    const { errors } = updateTask(task.id, { priority: 'invalida' });
    expect(errors).toBeDefined();
  });

  test('actualiza updatedAt al modificar', () => {
    const { task } = createTask({ title: 'Tarea' });
    const { task: updated } = updateTask(task.id, { title: 'Nueva' });
    expect(updated.updatedAt).toBeDefined();
    expect(new Date(updated.updatedAt).toISOString()).toBe(updated.updatedAt);
    expect(updated.title).toBe('Nueva');
  });
});

// ─── deleteTask ───────────────────────────────────────────────────────────────

describe('deleteTask()', () => {
  test('elimina una tarea existente', () => {
    const { task } = createTask({ title: 'Borrar' });
    const { deleted } = deleteTask(task.id);
    expect(deleted).toBe(true);
    expect(getTaskById(task.id)).toBeNull();
  });

  test('retorna deleted:false para ID inexistente', () => {
    const { deleted } = deleteTask('no-existe');
    expect(deleted).toBe(false);
  });
});

// ─── getStats ─────────────────────────────────────────────────────────────────

describe('getStats()', () => {
  test('retorna estadísticas correctas', () => {
    createTask({ title: 'T1', status: 'pending', priority: 'high' });
    createTask({ title: 'T2', status: 'done', priority: 'low' });
    createTask({ title: 'T3', status: 'in_progress', priority: 'medium' });

    const stats = getStats();
    expect(stats.total).toBe(3);
    expect(stats.byStatus.done).toBe(1);
    expect(stats.byStatus.pending).toBe(1);
    expect(stats.byPriority.high).toBe(1);
  });

  test('retorna ceros cuando no hay tareas', () => {
    const stats = getStats();
    expect(stats.total).toBe(0);
    expect(stats.byStatus.pending).toBe(0);
  });
});
