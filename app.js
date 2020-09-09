const todoForm = document.getElementById('todo-form');
const todoListHtml = document.getElementById('todo-list');
const sidenavList = document.getElementById('sidenav-list');
const newListForm = document.getElementById('new-list-form');

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

// Edit todo
function editTodo(e) {
  // Select todo li html element
  const todoListItem = e.target.parentElement.parentElement;
  // Get todo id from data attribute and make it a number
  const id = parseInt(todoListItem.dataset.todo_id);
  // If id mathces todo id, then change todo text
  allTodos[currentList].forEach((todo) => {
    if (todo.id === id) {
      todo.text = e.target.value;
    }
  });
  // Disable input after edit complete
  e.target.disabled = true;
  // Save todos to local storage
  setTodos(allTodos);
}

// Create new list
function newList(listName) {
  // Create new list with an empty array
  allTodos[listName.toLowerCase()] = [];
  // Save all lists with their todos to a local storage
  // setTodos(allTodos);
}

// Delete list
function deleteList(e) {
  // Get list item id
  const id = e.target.previousSibling.id;
  // Delete list using id
  delete allTodos[id];
  // Remove from DOM
  e.target.parentElement.parentElement.removeChild(e.target.parentElement);
  // Save to local storage
  setTodos(allTodos);
}

// Active list
function activeList(e) {
  // Change current list to the one that was clicked
  currentList = String(e.target.id);
  // Call todoList function to change visbile todos
  todoList();
  // Select current active list on the sidenav and remove .active class
  document.querySelector('.sidenav-item.active').classList.remove('active');
  // Add .active class to the current list
  e.target.classList.add('active');
}

// Switch to a different todo list
function switchList() {
  // Select all sidenav items
  const todoListItems = document.querySelectorAll('.sidenav-item');
  // Add even listeners for each sidenav item
  todoListItems.forEach((item) => {
    // First remove event listeners if there are any
    item.removeEventListener('click', activeList);
    // And then add new event listeners
    item.addEventListener('click', activeList);
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
  checkbox.classList = 'checkbox';
  checkbox.checked = todo.complete;

  const todoText = document.createElement('input');
  todoText.type = 'text';
  todoText.classList = 'todo-text';
  todoText.value = todo.text;
  todoText.disabled = true;

  const deleteBtn = document.createElement('button');
  deleteBtn.classList = 'delete-btn';
  deleteBtn.innerText = 'X';

  todoContent.append(checkbox, todoText);
  listItem.append(todoContent, deleteBtn);

  return listItem;
}

// Sidenav list item
function sidenavListItem(list) {
  // Capitalize first letter
  const listTitle = list.charAt(0).toUpperCase() + list.slice(1);
  const listItem = document.createElement('div');
  listItem.id = list.toLowerCase();
  listItem.classList =
    list === 'inbox' ? 'sidenav-item active' : 'sidenav-item';
  listItem.innerText = listTitle;

  const listItemDeleteBtn = document.createElement('button');
  listItemDeleteBtn.classList = 'delete-btn';
  listItemDeleteBtn.innerText = 'X';

  const listItemWrapper = document.createElement('li');
  listItemWrapper.classList = 'list-item-wrapper';

  // Check if list is inbox or important, then don't add delete button
  // Else add delete button
  if (list === 'inbox' || list === 'important') {
    listItemWrapper.append(listItem);
  } else {
    listItemWrapper.append(listItem, listItemDeleteBtn);
  }

  return listItemWrapper;
}

// Show all lists in a sidenav
function allLists() {
  // Get all list names from an object
  const lists = Object.keys(allTodos);
  // Go through lists, create li for each and add them to DOM
  lists.forEach((list) => {
    const listItem = sidenavListItem(list);

    sidenavList.appendChild(listItem);
  });
}

// Add all todos to DOM
function todoList() {
  // First clear todo list
  todoListHtml.innerHTML = '';
  // Check if there are any todos on the current list
  allTodos[currentList].length
    ? // If there, append each to the html
      allTodos[currentList].forEach((todo) =>
        todoListHtml.appendChild(listItem(todo))
      )
    : // If there are none display message Nothing todo...
      (todoListHtml.innerHTML =
        '<h3 class="nothing-todo">Nothing todo...</h3>');
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
  // Check if there are any todos in a list
  // If there are none, then remove Nothing todo... message
  if (!allTodos[currentList].length) todoListHtml.innerHTML = '';
  // Select new todo text input
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
    // Check if there are any todos left in a list
    // If there are none left show Nothing todo... message
    if (!allTodos[currentList].length)
      todoListHtml.innerHTML = '<h3 class="nothing-todo">Nothing todo...</h3>';
  }
});

// Add double click event listener to start editing todo
todoListHtml.addEventListener('dblclick', (e) => {
  // After double click check if it has class todo-text
  if (e.target.classList.contains('todo-text')) {
    // Enable input for editing
    e.target.disabled = false;
    // Set focus on that input
    e.target.focus();
    // Add blur and enter event listener to complete editing todo
    e.target.addEventListener('blur', editTodo);
    e.target.addEventListener('keyup', (e) => e.key === 'Enter' && editTodo(e));
  }
});

// Add event listener to a new todo list form
newListForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Select new list name input
  const textInput = newListForm['list-name'];
  // Check for empty input
  if (!textInput.value) return;
  // Add new list to allTodos object
  newList(textInput.value);
  // Add new list name to the sidenav
  sidenavList.appendChild(sidenavListItem(textInput.value));
  // Clear form
  textInput.value = '';
  // Reload sidenav
  switchList();
});

// Add event listener for todo list
sidenavList.addEventListener('click', (e) => {
  // Check if delete button was clicked
  if (e.target.classList.contains('delete-btn')) {
    deleteList(e);
  }
});

// Init app
init();
