const request = require('supertest');
const app = require('../src/index');

describe('Tasks API', () => {
  let server;
  
  beforeAll(() => {
    server = app.listen(3001);
  });
  
  afterAll((done) => {
    server.close(done);
  });
  
  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ title: 'Test Task', description: 'Test Description' });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Task');
      expect(response.body.completed).toBe(false);
    });
    
    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ description: 'No title' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Title is required');
    });
  });
  
  describe('GET /tasks', () => {
    it('should return all tasks', async () => {
      const response = await request(app).get('/tasks');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
  
  describe('GET /tasks/:id', () => {
    it('should return a task by id', async () => {
      const createResponse = await request(app)
        .post('/tasks')
        .send({ title: 'Get Task' });
      
      const taskId = createResponse.body.id;
      const response = await request(app).get(`/tasks/${taskId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(taskId);
    });
    
    it('should return 404 for non-existent task', async () => {
      const response = await request(app).get('/tasks/99999');
      expect(response.status).toBe(404);
    });
  });
  
  describe('PUT /tasks/:id', () => {
    it('should update a task', async () => {
      const createResponse = await request(app)
        .post('/tasks')
        .send({ title: 'Update Task' });
      
      const taskId = createResponse.body.id;
      const response = await request(app)
        .put(`/tasks/${taskId}`)
        .send({ title: 'Updated Title', completed: true });
      
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
      expect(response.body.completed).toBe(true);
    });
  });
  
  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      const createResponse = await request(app)
        .post('/tasks')
        .send({ title: 'Delete Task' });
      
      const taskId = createResponse.body.id;
      const response = await request(app).delete(`/tasks/${taskId}`);
      
      expect(response.status).toBe(204);
      
      const getResponse = await request(app).get(`/tasks/${taskId}`);
      expect(getResponse.status).toBe(404);
    });
  });
});
