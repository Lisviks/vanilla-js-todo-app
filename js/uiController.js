const UICtrl = (function () {
  const UISelectors = {
    todoList: '#todo-list',
    todoForm: '#todo-form',
    projectList: '#project-list',
    deleteBtn: '.delete-btn',
    modal: '.modal',
    newProjectForm: '#new-project-form',
    projectItemWrapper: '.project-item-wrapper',
  };

  // Todo html list item
  const todoItem = (todo) => {
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
  };

  // Project html list item
  const projectItem = (project) => {
    // Capitalize first letter
    const projectTitle = project.charAt(0).toUpperCase() + project.slice(1);
    const listItem = document.createElement('div');
    listItem.id = project.toLowerCase();
    listItem.classList =
      project === 'inbox' ? 'sidenav-item active' : 'sidenav-item';
    listItem.innerText = projectTitle;

    const listItemDeleteBtn = document.createElement('button');
    listItemDeleteBtn.classList = 'delete-btn';
    listItemDeleteBtn.innerText = 'X';

    const listItemWrapper = document.createElement('li');
    listItemWrapper.classList = 'project-item-wrapper';

    // Check if list is inbox or important, then don't add delete button
    // Else add delete button
    if (project === 'inbox' || project === 'important') {
      listItemWrapper.append(listItem);
    } else {
      listItemWrapper.append(listItem, listItemDeleteBtn);
    }

    return listItemWrapper;
  };

  return {
    populateTodoList: function (todos) {
      const todoList = document.querySelector(UISelectors.todoList);
      // First clear todo list
      todoList.innerHTML = '';
      // Check if there are any todos on the current list
      todos.length
        ? // If there, append each to the html
          todos.forEach((todo) => todoList.appendChild(todoItem(todo)))
        : // If there are none display message Nothing todo...
          (todoList.innerHTML =
            '<h3 class="nothing-todo">Nothing todo...</h3>');
    },
    populateProjectsList: function (projects) {
      const projectList = document.querySelector(UISelectors.projectList);
      // First clear project list
      projectList.innerHTML = '';
      // Append each project to the html
      projects.forEach((project) =>
        projectList.appendChild(projectItem(project))
      );
    },
    getSelectors: function () {
      return UISelectors;
    },
    getTodoText: function () {
      return document.querySelector(UISelectors.todoForm)['todo-text'].value;
    },
    clearTodoForm: function () {
      document.querySelector(UISelectors.todoForm)['todo-text'].value = '';
    },
    addTodo: function (todo) {
      const todoList = document.querySelector(UISelectors.todoList);
      todoList.appendChild(todoItem(todo));
    },
    deleteConfirmModal: function (itemToDeleteText) {
      const modal = document.createElement('div');
      modal.classList = 'modal';
      const modalContent = document.createElement('div');
      modalContent.classList = 'modal-content';
      const message = document.createElement('p');
      message.innerText = `Are you sure you want to delete "${itemToDeleteText}"?`;
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

      return modal;
    },
    closeModal: function () {
      document.querySelector(UISelectors.modal).remove();
    },
    removeTodo: function (id) {
      const todo = document.querySelector(`[data-todo_id='${id}']`);
      todo.remove();
    },
    getNewProjectName: function () {
      const newProjectForm = document.querySelector(UISelectors.newProjectForm);
      return newProjectForm['project-name'].value;
    },
    addProject: function (projectName) {
      const project = projectItem(projectName);
      document.querySelector(UISelectors.projectList).appendChild(project);
    },
    clearNewProjectForm: function () {
      document.querySelector(UISelectors.newProjectForm)['project-name'].value =
        '';
    },
    changeProject: function (projectName) {
      const projects = document.querySelectorAll(
        UISelectors.projectItemWrapper
      );
      projects.forEach((project) => {
        const div = project.querySelector('div');
        if (div.id === projectName) {
          div.classList.add('active');
        } else {
          div.classList.remove('active');
        }
      });
    },
  };
})();
