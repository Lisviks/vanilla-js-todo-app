const todoForm = document.getElementById('todo-form');
const todoListHtml = document.getElementById('todo-list');
const sidenavList = document.getElementById('sidenav-list');

// Get todos from local storage, if no todos then return empty array
function getTodos() {
  const defaultLists = { inbox: [], important: [] };
  return JSON.parse(localStorage.getItem('todos')) || defaultLists;
}

// Save todos to local storage
function setTodos(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

const allTodos = getTodos();
let currentList = 'inbox';

function newTodo(text) {
  // Check last todo id in the todos array and add 1 to it for the new todo
  const id = allTodos[currentList].length
    ? allTodos[currentList][allTodos[currentList].length - 1].id + 1
    : 1;
  // New todo object
  const todo = { id, text, complete: false };
  // Add new todo to the current list todos array
  allTodos[currentList].push(todo);

  // Save todos to local storage
  setTodos(allTodos);

  return todo;
}

// Toggle todo complete
function toggleTodo(id) {
  // Map through todos array and toggle todo complete with matching id
  allTodos[currentList].forEach((todo) => {
    if (todo.id === id) todo.complete = !todo.complete;
  });
  // Save to local storage
  setTodos(allTodos);
}

// Delete todo
function deleteTodo(id) {
  // Filter out todo that matches id
  const newTodosArr = allTodos[currentList].filter((todo) => todo.id !== id);
  // Replace current list todos array with a new array
  allTodos[currentList] = newTodosArr;
  // Save to local storage
  setTodos(allTodos);
}

// Switch to a different todo list
function switchList() {
  // Select all sidenav items
  const todoListItems = document.querySelectorAll('.sidenav-item');
  // Add even listeners for each sidenav item
  todoListItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      // Change current list to the one that was clicked
      currentList = String(e.target.id);
      // Call todoList function to change visbile todos
      todoList();
      // Select current active list on the sidenav and remove .active class
      document.querySelector('.sidenav-item.active').classList.remove('active');
      // Add .active class to the current list
      e.target.classList.add('active');
    });
  });
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

// Show all lists in a sidenav
function allLists() {
  // Get all list names from an object
  const lists = Object.keys(allTodos);
  // Go through lists, create li for each and add them to DOM
  lists.forEach((list) => {
    // Capitalize first letter
    const listTitle = list.charAt(0).toUpperCase() + list.slice(1);
    const sidenavListItem = document.createElement('li');
    sidenavListItem.id = list;
    sidenavListItem.classList =
      list === 'inbox' ? 'sidenav-item active' : 'sidenav-item';
    sidenavListItem.innerText = listTitle;

    sidenavList.appendChild(sidenavListItem);
  });
}

// Add all todos to DOM
function todoList() {
  todoListHtml.innerHTML = '';
  allTodos[currentList].forEach((todo) =>
    todoListHtml.appendChild(listItem(todo))
  );
}

// Initialize app function
function init() {
  allLists();
  switchList();
  todoList();
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
init();
