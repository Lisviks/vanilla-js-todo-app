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
        }
      });
  };

  const addTodo = function (e) {
    // Get todo text from UI Controller
    const text = UICtrl.getTodoText();
    // Check if text is empty, if empty return
    if (!text) return;

    // Add todo
    const todo = ItemCtrl.addTodo(text);
    // Add todo to UI list
    UICtrl.addTodo(todo, deleteTodo);
    // Get currently selected project
    const currentProject = ItemCtrl.getCurrentProject();
    // Store in localStorage
    StorageCtrl.storeTodo(todo, currentProject);
    // Clear todo from input
    UICtrl.clearTodoForm();

    e.preventDefault();
  };

  const openDeleteConfirmModal = function (e) {
    const id = parseInt(e.target.parentElement.dataset.todo_id);
    const todo = ItemCtrl.getTodoById(id);

    ItemCtrl.setTodoToDelete(todo);
    const modal = UICtrl.deleteConfirmModal(todo.text);

    // Close modal events
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) UICtrl.closeModal();
    });
    modal
      .querySelector('.modal-cancel-btn')
      .addEventListener('click', UICtrl.closeModal());
    // Delete todo event
    modal.querySelector('.modal-delete-btn').addEventListener('click', () => {
      deleteTodo();
      // Close modal
      UICtrl.closeModal();
    });
  };

  const deleteTodo = function () {
    // Get todo id
    const id = ItemCtrl.getTodoToDelete().id;
    // Delete from data structure
    ItemCtrl.deleteTodo(id);
    // Delete from UI
    UICtrl.removeTodo(id);
    // Delete from localStorage
    const currentProject = ItemCtrl.getCurrentProject();
    StorageCtrl.deleteTodo(id, currentProject);
  };

  const toggleTodo = function (e) {
    // Get id
    const id = parseInt(e.target.parentElement.parentElement.dataset.todo_id);
    // Get todo
    const todo = ItemCtrl.getTodoById(id);
    // Toggle complete
    todo.complete = !todo.complete;
    // Update todo
    ItemCtrl.updateTodo(todo);
    const currentProject = ItemCtrl.getCurrentProject();
    StorageCtrl.updateTodo(todo, currentProject);
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
    // Get project todos
    const todos = ItemCtrl.getTodos();
    // Change active project highlight
    UICtrl.changeProject(id);
    // Repopulate todos
    UICtrl.populateTodoList(todos);
  };

  return {
    init: function () {
      const todos = ItemCtrl.getTodos();
      UICtrl.populateTodoList(todos, deleteTodo);
      const projects = ItemCtrl.getProjects();
      UICtrl.populateProjectsList(projects);

      // Load event listeners
      loadEventListeners();
    },
  };
})();

AppCtrl.init();
