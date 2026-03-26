const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Base de datos en memoria
let tasks = [];
let nextId = 1;

// Endpoints documentados

/**
 * GET /tasks
 * Obtener todas las tareas
 */
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

/**
 * GET /tasks/:id
 * Obtener una tarea por ID
 */
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

/**
 * POST /tasks
 * Crear una nueva tarea
 */
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const task = {
    id: nextId++,
    title,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(task);
  res.status(201).json(task);
});

/**
 * PUT /tasks/:id
 * Actualizar una tarea
 */
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const { title, description, completed } = req.body;
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title || tasks[taskIndex].title,
    description: description !== undefined ? description : tasks[taskIndex].description,
    completed: completed !== undefined ? completed : tasks[taskIndex].completed,
    updatedAt: new Date().toISOString()
  };
  
  res.json(tasks[taskIndex]);
});

/**
 * DELETE /tasks/:id
 * Eliminar una tarea
 */
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// Iniciar servidor
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET    /tasks');
    console.log('  GET    /tasks/:id');
    console.log('  POST   /tasks');
    console.log('  PUT    /tasks/:id');
    console.log('  DELETE /tasks/:id');
  });
}

module.exports = app;
