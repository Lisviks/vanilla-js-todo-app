const AppCtrl = (function () {
  const loadEventListeners = function () {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add todo event
    document
      .querySelector(UISelectors.todoForm)
      .addEventListener('submit', addTodo);
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

  const deleteTodo = function (e) {
    // Get todo id
    const id = parseInt(e.target.parentElement.dataset.todo_id);
    // Delete from data structure
    ItemCtrl.deleteTodo(id);
    // Delete from UI
    UICtrl.removeTodo(id);
    // Delete from localStorage
    const currentProject = ItemCtrl.getCurrentProject();
    StorageCtrl.deleteTodo(id, currentProject);
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
