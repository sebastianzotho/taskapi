const express = require('express');
const router = express.Router();
const taskService = require('./taskService');

// GET /tasks — listar todas (con filtros opcionales ?status=&priority=)
router.get('/', (req, res) => {
  const { status, priority } = req.query;
  const tasks = taskService.getAllTasks({ status, priority });
  res.json({ success: true, data: tasks, total: tasks.length });
});

// GET /tasks/stats — estadísticas
router.get('/stats', (req, res) => {
  const stats = taskService.getStats();
  res.json({ success: true, data: stats });
});

// GET /tasks/:id — obtener una tarea
router.get('/:id', (req, res) => {
  const task = taskService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
  }
  res.json({ success: true, data: task });
});

// POST /tasks — crear tarea
router.post('/', (req, res) => {
  const { task, errors } = taskService.createTask(req.body);
  if (errors) {
    return res.status(400).json({ success: false, errors });
  }
  res.status(201).json({ success: true, data: task });
});

// PUT /tasks/:id — actualizar tarea
router.put('/:id', (req, res) => {
  const { task, errors, notFound } = taskService.updateTask(req.params.id, req.body);
  if (notFound) {
    return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
  }
  if (errors) {
    return res.status(400).json({ success: false, errors });
  }
  res.json({ success: true, data: task });
});

// DELETE /tasks/:id — eliminar tarea
router.delete('/:id', (req, res) => {
  const { deleted } = taskService.deleteTask(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
  }
  res.json({ success: true, message: 'Tarea eliminada correctamente' });
});

module.exports = router;
