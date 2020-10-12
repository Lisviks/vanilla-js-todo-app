const UICtrl = (function () {
  const UISelectors = {
    todoList: '#todo-list',
    todoListItem: '.todo-list-item',
    todoForm: '#todo-form',
    subTodoForm: '#sub-todo-form',
    subTodoList: '#sub-todo-list',
    projectList: '#project-list',
    deleteBtn: '.delete-btn',
    todoModal: '.todo-modal',
    deleteModal: '.delete-modal',
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

    const todoText = document.createElement('span');
    todoText.type = 'text';
    todoText.classList = 'todo-text';
    todoText.innerText = todo.text;
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
    populateTodoList: function (todos, listToPopulate = 'todoList') {
      const todoList = document.querySelector(UISelectors[listToPopulate]);
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
    getTodoText: function (form = 'todoForm') {
      return document.querySelector(UISelectors[form])['form-text'].value;
    },
    clearForm: function (formToClear) {
      // formToClear - todoForm, subTodoForm, newProjectForm
      document.querySelector(UISelectors[formToClear])['form-text'].value = '';
    },
    addTodo: function (todo, todoList = 'todoList') {
      const list = document.querySelector(UISelectors[todoList]);
      list.appendChild(todoItem(todo));
    },
    updateTodo: function (todo) {
      const allTodos = document.querySelectorAll(UISelectors.todoListItem);
      allTodos.forEach((todoEl) => {
        if (parseInt(todoEl.dataset.todo_id) === todo.id) {
          todoEl.querySelector('.todo-text').innerText = todo.text;
        }
      });
    },
    enableInput: function (input) {
      input.disabled = false;
      input.focus();
    },
    disableInput: function (input) {
      input.disabled = true;
    },
    getEditTodoText: function (input) {
      return input.value;
    },
    deleteConfirmModal: function (itemToDeleteText) {
      const modal = document.createElement('div');
      modal.classList = 'modal delete-modal';
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
    subTasksTab: function () {
      const subTodoTabContent = document.createElement('div');
      subTodoTabContent.classList = 'sub-todo-tab-content';

      const todoList = document.createElement('ul');
      todoList.classList = 'todo-list';
      todoList.id = 'sub-todo-list';

      const todoForm = document.createElement('form');
      todoForm.classList = 'todo-form';
      todoForm.id = 'sub-todo-form';
      const inputField = document.createElement('div');
      inputField.classList = 'input-field';
      const input = document.createElement('input');
      input.type = 'text';
      input.classList = 'todo-text';
      input.id = 'form-text';
      input.autocomplete = false;
      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.classList = 'add-btn btn';
      submitBtn.innerText = 'Add Task';

      inputField.appendChild(input);
      todoForm.append(inputField, submitBtn);
      subTodoTabContent.append(todoList, todoForm);

      return subTodoTabContent;
    },
    commentsTab: function () {
      const commentsTabContent = document.createElement('div');
      commentsTabContent.classList = 'comments-tab-content';

      const comments = document.createElement('ul');
      comments.classList = 'comments-list';

      const commentsForm = document.createElement('form');
      commentsForm.classList = 'comments-form';
      const inputField = document.createElement('div');
      inputField.classList = 'input-field';
      const input = document.createElement('input');
      input.type = 'text';
      input.classList = 'comment-text';
      input.id = 'form-text';
      input.autocomplete = false;
      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.classList = 'add-btn btn';
      submitBtn.innerText = 'Add Comment';

      inputField.appendChild(input);
      commentsForm.append(inputField, submitBtn);
      commentsTabContent.append(comments, commentsForm);

      return commentsTabContent;
    },
    todoModal: function (todo, currentProject, tab) {
      const modal = document.createElement('div');
      modal.classList = 'modal todo-modal';
      const modalContent = document.createElement('div');
      modalContent.classList = 'modal-content';

      const header = document.createElement('div');
      header.classList = 'todo-modal-header';
      const todoProject = document.createElement('span');
      todoProject.innerText =
        currentProject.charAt(0).toUpperCase() + currentProject.slice(1);
      const closeBtn = document.createElement('button');
      closeBtn.classList = 'close-modal-btn';
      closeBtn.innerText = 'X';

      const todoContent = document.createElement('div');
      todoContent.classList = 'todo';
      todoContent.dataset.todo_id = todo.id;
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList = 'checkbox';
      checkbox.checked = todo.complete;
      const todoText = document.createElement('input');
      todoText.type = 'text';
      todoText.classList = 'todo-text';
      todoText.value = todo.text;
      todoText.disabled = true;

      const tabList = document.createElement('div');
      tabList.classList = 'todo-modal-tab-list';
      const subTasks = document.createElement('button');
      subTasks.classList = 'todo-modal-sub-tasks-tab tab-btn active';
      subTasks.innerText = 'Sub-tasks';
      const comments = document.createElement('button');
      comments.classList = 'todo-modal-comments-tab tab-btn';
      comments.innerText = 'Comments';
      const tabContent = document.createElement('div');
      tabContent.classList = 'tab-content';

      header.append(todoProject, closeBtn);
      todoContent.append(checkbox, todoText);
      tabList.append(subTasks, comments);
      tabContent.appendChild(tab);
      modalContent.append(header, todoContent, tabList, tabContent);
      modal.appendChild(modalContent);

      document.querySelector('body').appendChild(modal);

      return modal;
    },
    closeModal: function (modalToClose) {
      // modalToClose - todoModal, deleteModal
      document.querySelector(UISelectors[modalToClose]).remove();
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
    removeProject: function (projectName) {
      const projects = document.querySelectorAll(
        UISelectors.projectItemWrapper
      );
      projects.forEach((project) => {
        const div = project.querySelector('div');
        if (div.id === projectName) {
          project.remove();
        }
      });
    },
  };
})();
