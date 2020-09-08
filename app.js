const todoForm = document.getElementById('todo-form');
const todoListHtml = document.getElementById('todo-list');

// Get todos from local storage, if no todos then return empty array
function getTodos() {
  return JSON.parse(localStorage.getItem('todos')) || [];
}

// Save todos to local storage
function setTodos(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

const todos = getTodos();

function newTodo(text) {
  // Check last todo id in the todos array and add 1 to it for the new todo
  const id = todos.length ? todos[todos.length - 1].id + 1 : 1;
  // New todo object
  const todo = { id, text, complete: false };
  // Add new todo to the todos array
  todos.push(todo);

  // Save todos to local storage
  setTodos(todos);

  return todo;
}

// Toggle todo complete
function toggleTodo(id) {
  // Map through todos array and toggle todo complete with matching id
  const newTodosArr = todos.map((todo) => {
    if (todo.id === id) todo.complete = !todo.complete;
    return todo;
  });
  // Save to local storage
  setTodos(newTodosArr);
}

// Delete todo
function deleteTodo(id) {
  // Filter out todo that matches id
  const newTodosArr = todos.filter((todo) => todo.id !== id);
  // Save to local storage
  setTodos(newTodosArr);
}

// Create list item for html
function listItem(todo) {
  const listItem = document.createElement('li');
  listItem.classList = 'todo-list-item';
  listItem.dataset.todo_id = todo.id;

  const todoContent = document.createElement('div');
  todoContent.classList = 'todo';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = todo.id;
  checkbox.classList = 'checkbox';
  checkbox.checked = todo.complete;

  const todoText = document.createElement('label');
  todoText.htmlFor = todo.id;
  todoText.innerText = todo.text;

  const deleteBtn = document.createElement('button');
  deleteBtn.classList = 'delete-btn';
  deleteBtn.innerText = 'X';

  todoContent.append(checkbox, todoText);
  listItem.append(todoContent, deleteBtn);

  return listItem;
}

// Add all todos to DOM
function todoList() {
  todoListHtml.innerHTML = '';
  todos.forEach((todo) => todoListHtml.appendChild(listItem(todo)));
}

// Add event listener to a todo form
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Get new todo text from form
  const textInput = todoForm['todo-text'];
  // Check for empty input
  if (!textInput.value) return;
  // Add new todo to the todos array
  const todo = newTodo(textInput.value);
  // Add new todo to DOM
  todoListHtml.appendChild(listItem(todo));
  // Clear form
  textInput.value = '';
});

// Add event listener for toggling and deleting todos
todoListHtml.addEventListener('click', (e) => {
  // Check if whatever was clicked has a class checkbox
  if (e.target.classList.contains('checkbox')) {
    // Select todo li html element
    const todoListItem = e.target.parentElement.parentElement;
    // Get todo id from data attribute and make it a number
    const id = parseInt(todoListItem.dataset.todo_id);
    // Use toggleTodo function to toggle todo
    toggleTodo(id);

    // Check if delete button was clicked
  } else if (e.target.classList.contains('delete-btn')) {
    // Select todo li html element
    const todoListItem = e.target.parentElement;
    // Get todo id
    const id = parseInt(todoListItem.dataset.todo_id);
    // Use deleteTodo function to delete todo from array and local storage
    deleteTodo(id);
    // Remove todo from DOM
    todoListItem.parentElement.removeChild(todoListItem);
  }
});

// Init app
todoList();
