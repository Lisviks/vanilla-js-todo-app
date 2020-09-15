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
function deleteTodo(id, htmlElement) {
  // Filter out todo that matches id
  const newTodosArr = allTodos[currentList].filter((todo) => todo.id !== id);
  // Replace current list todos array with a new array
  allTodos[currentList] = newTodosArr;
  // Remove todo from DOM
  htmlElement.parentElement.removeChild(htmlElement);
  // Check if there are any todos left in a list
  // If there are none left show Nothing todo... message
  if (!allTodos[currentList].length)
    todoListHtml.innerHTML = '<h3 class="nothing-todo">Nothing todo...</h3>';
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
  setTodos(allTodos);
}

// Delete list
function deleteList(id, htmlElement) {
  // Delete list using id
  delete allTodos[id];
  // Remove from DOM
  htmlElement.parentElement.removeChild(htmlElement);
  // Change current active list to inbox and add class active
  currentList = 'inbox';
  document.getElementById('inbox').classList.add('active');
  // Load inbox todos
  todoList();
  // Save to local storage
  setTodos(allTodos);
}

// Confirm delete modal
function confirmDeleteModal(itemToDelete, htmlElement, type = 'todo') {
  const modal = document.createElement('div');
  modal.classList = 'modal';
  const modalContent = document.createElement('div');
  modalContent.classList = 'modal-content';
  const message = document.createElement('p');
  message.innerText = `Are you sure you want to delete "${itemToDelete.text}"?`;
  const dialogActions = document.createElement('div');
  dialogActions.classList = 'dialog-actions';
  const cancelBtn = document.createElement('button');
  cancelBtn.classList = 'modal-cancel-btn btn';
  cancelBtn.innerText = 'Cancel';
  const deleteBtn = document.createElement('button');
  deleteBtn.classList = 'modal-delete-btn btn';
  deleteBtn.innerText = 'Delete';

  dialogActions.append(cancelBtn, deleteBtn);
  modalContent.append(message, dialogActions);
  modal.appendChild(modalContent);

  document.querySelector('body').appendChild(modal);

  // Close modal without deleting
  cancelBtn.addEventListener('click', () => {
    modal.parentElement.removeChild(modal);
  });
  // Delete item
  deleteBtn.addEventListener('click', () => {
    // Check what is getting deleted
    if (type === 'list') {
      deleteList(itemToDelete.id, htmlElement);
    } else {
      // Use deleteTodo function to delete todo from array and local storage
      deleteTodo(itemToDelete.id, htmlElement);
    }
    // Close modal
    modal.parentElement.removeChild(modal);
  });
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

// Initialize app function
function init() {
  allLists();
  switchList();
  // todoList();
}

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
    const htmlElement = e.target.parentElement;
    // Get todo id
    const id = parseInt(htmlElement.dataset.todo_id);
    // Get todo
    const todo = allTodos[currentList].filter((todo) => todo.id === id)[0];
    // Open modal
    confirmDeleteModal(todo, htmlElement);
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
    // Get list item id
    const id = e.target.previousSibling.id;
    // Get list title
    const text = e.target.previousSibling.innerText;
    // Get html element for the list
    const htmlElement = e.target.parentElement;
    confirmDeleteModal({ text, id }, htmlElement, 'list');
  }
});

// Init app
init();
