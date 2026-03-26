const { v4: uuidv4 } = require('uuid');

// In-memory store (reemplazable por DB real)
let tasks = [];

/**
 * Valida que un objeto tarea tenga los campos requeridos y válidos.
 * @param {object} data
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateTask(data) {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    errors.push('El campo "title" es requerido y debe ser un string no vacío');
  } else if (data.title.trim().length > 200) {
    errors.push('El campo "title" no puede superar los 200 caracteres');
  }

  if (data.priority !== undefined) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(data.priority)) {
      errors.push(`El campo "priority" debe ser uno de: ${validPriorities.join(', ')}`);
    }
  }

  if (data.status !== undefined) {
    const validStatuses = ['pending', 'in_progress', 'done'];
    if (!validStatuses.includes(data.status)) {
      errors.push(`El campo "status" debe ser uno de: ${validStatuses.join(', ')}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Obtiene todas las tareas, con filtros opcionales.
 * @param {{ status?: string, priority?: string }} filters
 * @returns {object[]}
 */
function getAllTasks(filters = {}) {
  let result = [...tasks];

  if (filters.status) {
    result = result.filter(t => t.status === filters.status);
  }
  if (filters.priority) {
    result = result.filter(t => t.priority === filters.priority);
  }

  return result;
}

/**
 * Obtiene una tarea por su ID.
 * @param {string} id
 * @returns {object|null}
 */
function getTaskById(id) {
  return tasks.find(t => t.id === id) || null;
}

/**
 * Crea una nueva tarea.
 * @param {object} data
 * @returns {{ task?: object, errors?: string[] }}
 */
function createTask(data) {
  const { valid, errors } = validateTask(data);
  if (!valid) return { errors };

  const task = {
    id: uuidv4(),
    title: data.title.trim(),
    description: data.description ? data.description.trim() : '',
    priority: data.priority || 'medium',
    status: data.status || 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(task);
  return { task };
}

/**
 * Actualiza una tarea existente.
 * @param {string} id
 * @param {object} data
 * @returns {{ task?: object, errors?: string[], notFound?: boolean }}
 */
function updateTask(id, data) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return { notFound: true };

  const { valid, errors } = validateTask({ ...tasks[index], ...data });
  if (!valid) return { errors };

  tasks[index] = {
    ...tasks[index],
    ...(data.title && { title: data.title.trim() }),
    ...(data.description !== undefined && { description: data.description.trim() }),
    ...(data.priority && { priority: data.priority }),
    ...(data.status && { status: data.status }),
    updatedAt: new Date().toISOString(),
  };

  return { task: tasks[index] };
}

/**
 * Elimina una tarea por ID.
 * @param {string} id
 * @returns {{ deleted: boolean }}
 */
function deleteTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return { deleted: false };

  tasks.splice(index, 1);
  return { deleted: true };
}

/**
 * Retorna estadísticas del conjunto de tareas.
 * @returns {object}
 */
function getStats() {
  const total = tasks.length;
  const byStatus = {
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };
  const byPriority = {
    low: tasks.filter(t => t.priority === 'low').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    high: tasks.filter(t => t.priority === 'high').length,
  };

  return { total, byStatus, byPriority };
}

/**
 * Limpia todas las tareas (útil para tests).
 */
function clearTasks() {
  tasks = [];
}

module.exports = {
  validateTask,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getStats,
  clearTasks,
};
