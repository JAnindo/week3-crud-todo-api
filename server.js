const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to TODO API',
    endpoints: {
      getAllTodos: 'GET /todos',
      getTodoById: 'GET /todos/:id',
      getActiveTodos: 'GET /todos/active',
      createTodo: 'POST /todos',
      updateTodo: 'PUT /todos/:id',
      deleteTodo: 'DELETE /todos/:id'
    }
  });
});

// In-memory data store
let todos = [
  { id: 1, task: "Learn Node.js", completed: false },
  { id: 2, task: "Build a REST API", completed: false },
  { id: 3, task: "Practice CRUD operations", completed: true }
];

let nextId = 4;

// ===== CREATE (POST) =====
// Create a new todo
app.post('/todos', (req, res) => {
  // Validation: POST requires "task" field
  if (!req.body.task) {
    return res.status(400).json({ 
      error: 'Validation failed: "task" field is required' 
    });
  }

  const newTodo = {
    id: nextId++,
    task: req.body.task,
    completed: req.body.completed || false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// ===== READ (GET) =====
// Get all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Get single todo by ID
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(todo);
});

// BONUS: Get active todos (filter out completed)
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  res.json(activeTodos);
});

// ===== UPDATE (PUT) =====
// Update a todo
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  // Update the todo
  todos[todoIndex] = {
    id: id,
    task: req.body.task || todos[todoIndex].task,
    completed: req.body.completed !== undefined ? req.body.completed : todos[todoIndex].completed
  };

  res.json(todos[todoIndex]);
});

// ===== DELETE (DELETE) =====
// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const deletedTodo = todos.splice(todoIndex, 1);
  res.json({ 
    message: 'Todo deleted successfully', 
    deletedTodo: deletedTodo[0] 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Todo API server running on http://localhost:${PORT}`);
  console.log('\nAvailable endpoints:');
  console.log('  GET    /todos          - Get all todos');
  console.log('  GET    /todos/:id      - Get single todo');
  console.log('  GET    /todos/active   - Get active todos (bonus)');
  console.log('  POST   /todos          - Create new todo');
  console.log('  PUT    /todos/:id      - Update todo');
  console.log('  DELETE /todos/:id      - Delete todo');
});