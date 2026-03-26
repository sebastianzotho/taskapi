const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Task routes
const taskRouter = require('./taskRouter');
app.use('/tasks', taskRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  // eslint-disable-next-line no-console
  app.listen(PORT, () => console.log(`TaskAPI corriendo en http://localhost:${PORT}`));
}
