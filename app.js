const express = require('express');
const methodOverride = require('method-override');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

let todos = [];
let idCounter = 1;

app.get('/', (req, res) => {
  const filter = req.query.filter;
  let filteredTodos = todos;
  if (filter && ['High', 'Medium', 'Low'].includes(filter)) {
    filteredTodos = todos.filter(todo => todo.priority === filter);
  }
  res.render('index', { todos: filteredTodos, filter, alert: req.query.alert });
});

app.post('/todos', (req, res) => {
  const { task, priority } = req.body;
  if (!task.trim()) {
    return res.redirect('/?alert=empty');
  }
  todos.push({ id: idCounter++, task: task.trim(), priority });
  res.redirect('/');
});

app.get('/todos/:id/edit', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.redirect('/');
  res.render('edit', { todo, alert: req.query.alert });
});

app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { task, priority } = req.body;
  if (!task.trim()) {
    return res.redirect(`/todos/${id}/edit?alert=empty`);
  }
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.task = task.trim();
    todo.priority = priority;
  }
  res.redirect('/');
});

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(t => t.id !== id);
  res.redirect('/');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
