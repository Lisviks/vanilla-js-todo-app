const AppCtrl = (function () {
  const loadEventListeners = function () {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add todo event
    document
      .querySelector(UISelectors.todoForm)
      .addEventListener('submit', addTodo);

    // Todo list events
    document
      .querySelector(UISelectors.todoList)
      .addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
          openDeleteConfirmModal(e);
        } else if (e.target.classList.contains('checkbox')) {
          toggleTodo(e);
        } else if (e.target.classList.contains('todo-text')) {
          openTodoModal(e);
        }
      });

    // Create new project
    document
      .querySelector(UISelectors.newProjectForm)
      .addEventListener('submit', createProject);

    // Project list events
    document
      .querySelector(UISelectors.projectList)
      .addEventListener('click', (e) => {
        if (e.target.classList.contains('sidenav-item')) {
          changeProject(e);
        } else if (e.target.classList.contains('delete-btn')) {
          deleteProject(e);
        }
      });
  };

  const subTaskEvents = function (e) {
    const UISelectors = UICtrl.getSelectors();
    document
      .querySelector(UISelectors.subTodoList)
      .addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
          openDeleteConfirmModal(e);
        } else if (e.target.classList.contains('checkbox')) {
          toggleTodo(e);
        } else if (e.target.classList.contains('todo-text')) {
          // openTodoModal(e);
        }
      });
  };

  const addTodo = function (e) {
    e.preventDefault();
    // Get todo text from UI Controller
    const text = UICtrl.getTodoText();
    // Check if text is empty, if empty return
    if (!text) return;

    // Add todo
    const todo = ItemCtrl.addTodo(text);
    // Check if its the first todo in a project
    const todos = ItemCtrl.getTodos();
    if (todos.length === 1) {
      // Remove Nothing todo... message by repopulating todo list
      UICtrl.populateTodoList(todos);
    } else {
      // Else append new todo
      // Add todo to UI list
      UICtrl.addTodo(todo);
    }
    // Get currently selected project
    const currentProject = ItemCtrl.getCurrentProject();
    // Store in localStorage
    StorageCtrl.storeTodo(todo, currentProject);
    // Clear todo from input
    UICtrl.clearForm('todoForm');
  };

  const addSubTodo = function (e) {
    e.preventDefault();

    const text = UICtrl.getTodoText('subTodoForm');
    const todo = ItemCtrl.addSubTodo(text);
    // Check if its the first sub-todo
    const currentTodo = ItemCtrl.getCurrentTodo();
    const todos = ItemCtrl.getTodos().filter(
      (todo) => todo.todoRef === currentTodo.id
    );
    if (todos.length === 1) {
      // Remove Nothing todo... message by repopulating todo list
      UICtrl.populateTodoList(todos, 'subTodoList');
    } else {
      // Else append new todo
      // Add todo to UI list
      UICtrl.addTodo(todo, 'subTodoList');
    }
    const currentProject = ItemCtrl.getCurrentProject();
    StorageCtrl.storeTodo(todo, currentProject);
    UICtrl.clearForm('subTodoForm');
  };

  const openDeleteConfirmModal = function (e) {
    const id = parseInt(e.target.parentElement.dataset.todo_id);
    const todo = ItemCtrl.getTodoById(id);

    ItemCtrl.setDeleteTodo(todo);
    const modal = UICtrl.deleteConfirmModal(todo.text);

    // Close modal events
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-modal'))
        UICtrl.closeModal('deleteModal');
    });
    modal
      .querySelector('.modal-cancel-btn')
      .addEventListener('click', () => UICtrl.closeModal('deleteModal'));
    // Delete todo event
    modal.querySelector('.modal-delete-btn').addEventListener('click', () => {
      deleteTodo();
      // Close modal
      UICtrl.closeModal('deleteModal');
    });
  };

  const deleteTodo = function () {
    // Get todo to delete
    const todoToDelete = ItemCtrl.getDeleteTodo();
    // Delete from data structure
    ItemCtrl.deleteTodo(todoToDelete.id);
    // Get todos without sub todos
    const todos = ItemCtrl.getTodos().filter((todo) => todo.todoRef === null);
    const subTodos = ItemCtrl.getTodos().filter(
      (todo) => todo.todoRef === todoToDelete.id
    );
    // Check if there are any todos left in current project
    if (!todos.length || !subTodos.length) {
      // Repopulate todo list with empty array to display nothing todo message
      todoToDelete.todoRef === null
        ? UICtrl.populateTodoList(todos)
        : UICtrl.populateTodoList(subTodos, 'subTodoList');
    } else {
      // Else remove todo
      // Delete from UI
      UICtrl.removeTodo(todoToDelete.id);
    }
    // Delete from localStorage
    const currentProject = ItemCtrl.getCurrentProject();
    StorageCtrl.deleteTodo(todoToDelete.id, currentProject);
  };

  const addComment = function (e) {
    e.preventDefault();
    // Get text from comment form input
    const commentsForm = document.querySelector('.comments-form');
    const inputText = commentsForm['form-text'].value;
    // Save comment on current todo to ls and ItemCtrl
    const todo = ItemCtrl.addComment(inputText);
    const currentProject = ItemCtrl.getCurrentProject();
    StorageCtrl.updateTodo(todo, currentProject);
    // Display new comment
    UICtrl.addComment(todo.comments[todo.comments.length - 1]);
    // Clear form
    UICtrl.clearCommentForm();
  };

  const switchTab = function (e) {
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach((tab) => tab.classList.remove('active'));
    // Add active class to the tab that was clicked
    e.target.classList.add('active');
    // Switch tab content
    const tabContent = document.querySelector('.tab-content');
    tabContent.innerHTML = '';
    // Check which tab was clicked
    if (e.target.classList.contains('todo-modal-sub-tasks-tab')) {
      tabContent.appendChild(UICtrl.subTasksTab());
      const subTodos = ItemCtrl.getSubTodos();
      UICtrl.populateTodoList(subTodos, 'subTodoList');
      subTaskEvents(e);
    } else if (e.target.classList.contains('todo-modal-comments-tab')) {
      tabContent.appendChild(UICtrl.commentsTab());
      const currentTodo = ItemCtrl.getCurrentTodo();
      UICtrl.populateCommentsList(currentTodo.comments);

      // Comments tab events
      document
        .querySelector('.comments-form')
        .addEventListener('submit', addComment);
    }
  };

  const openTodoModal = function (e) {
    const id = parseInt(e.target.parentElement.parentElement.dataset.todo_id);
    const todo = ItemCtrl.getTodoById(id);
    ItemCtrl.setCurrentTodo(todo);
    const currentProject = ItemCtrl.getCurrentProject();
    const subTasksTab = UICtrl.subTasksTab();
    const todoModal = UICtrl.todoModal(todo, currentProject, subTasksTab);

    const subTodos = ItemCtrl.getSubTodos();
    UICtrl.populateTodoList(subTodos, 'subTodoList');

    // Add sub todo event
    todoModal
      .querySelector('#sub-todo-form')
      .addEventListener('submit', addSubTodo);

    // Switch tab event
    todoModal
      .querySelector('.todo-modal-tab-list')
      .addEventListener('click', switchTab);

    // Edit todo event
    todoModal.querySelector('.todo').addEventListener('click', (e) => {
      if (e.target.classList.contains('checkbox')) {
        toggleTodo(e);
      } else if (e.target.classList.contains('todo-text')) {
        startEdit(e);
      }
    });

    subTaskEvents(e);

    // Close modal events
    todoModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) UICtrl.closeModal('todoModal');
    });
    todoModal
      .querySelector('.close-modal-btn')
      .addEventListener('click', () => UICtrl.closeModal('todoModal'));
  };

  const toggleTodo = function (e) {
    // Get id
    const id =
      parseInt(e.target.parentElement.parentElement.dataset.todo_id) ||
      parseInt(e.target.parentElement.dataset.todo_id);
    // Get todo
    const todo = ItemCtrl.getTodoById(id);
    // Toggle complete
    todo.complete = !todo.complete;
    // Update todo
    ItemCtrl.updateTodo(todo);
    const currentProject = ItemCtrl.getCurrentProject();
    StorageCtrl.updateTodo(todo, currentProject);
  };

  const startEdit = function (e) {
    const id = parseInt(e.target.parentElement.dataset.todo_id);

    const input = e.target;
    UICtrl.enableInput(input);
    // First remove event listeners from input if there are any
    input.removeEventListener('blur', completeEdit);
    input.removeEventListener('keyup', completeEdit);
    // Add event listeners for saving edit
    input.addEventListener('blur', completeEdit);
    input.addEventListener('keyup', completeEdit);
  };

  const completeEdit = function (e) {
    if (e.type === 'blur' || (e.type === 'keyup' && e.keyCode === 13)) {
      const todo = ItemCtrl.getCurrentTodo();
      const input = e.target;
      const editText = UICtrl.getEditTodoText(input);
      todo.text = editText;
      ItemCtrl.updateTodo(todo);
      const currentProject = ItemCtrl.getCurrentProject();
      StorageCtrl.updateTodo(todo, currentProject);
      UICtrl.disableInput(input);
      UICtrl.updateTodo(todo);
    }
  };

  const createProject = function (e) {
    e.preventDefault();
    // Get new project name
    const name = UICtrl.getNewProjectName();
    if (!name) return;
    // Add new project to data structure
    ItemCtrl.createProject(name);
    // Save to localStorage
    StorageCtrl.createProject(name);
    // Add project to dom
    UICtrl.addProject(name);
    // Clear form
    UICtrl.clearNewProjectForm();
  };

  const changeProject = function (e) {
    const id = e.target.id;
    // Set current project
    ItemCtrl.setCurrentProject(id);
    // Get project todos, while filtering out sub todos
    const todos = ItemCtrl.getTodos().filter((todo) => todo.todoRef === null);
    // Change active project highlight
    UICtrl.changeProject(id);
    // Repopulate todos
    UICtrl.populateTodoList(todos);
  };

  const deleteProject = function (e) {
    const id = e.target.previousSibling.id;
    ItemCtrl.deleteProject(id);
    StorageCtrl.deleteProject(id);
    UICtrl.removeProject(id);
  };

  return {
    init: function () {
      StorageCtrl.init();
      // Get project todos, while filtering out sub todos
      const todos = ItemCtrl.getTodos().filter((todo) => todo.todoRef === null);
      UICtrl.populateTodoList(todos);
      const projects = ItemCtrl.getProjects();
      UICtrl.populateProjectsList(projects);

      // Load event listeners
      loadEventListeners();
    },
  };
})();

AppCtrl.init();
