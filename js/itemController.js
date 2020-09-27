const ItemCtrl = (function () {
  // Todo constructor
  const Todo = function (id, text, todoRef = null) {
    this.id = id;
    this.text = text;
    this.todoRef = todoRef;
    this.complete = false;
  };

  // Data Structure / State
  const data = {
    todos: StorageCtrl.getTodos(),
    currentProject: 'inbox',
    currentTodo: null,
    deleteTodo: null,
  };

  return {
    getTodos: function () {
      return data.todos[data.currentProject];
    },
    getSubTodos: function () {
      return data.todos[data.currentProject].filter(
        (todo) => todo.todoRef === data.currentTodo.id
      );
    },
    getProjects: function () {
      return Object.keys(data.todos);
    },
    getCurrentProject: function () {
      return data.currentProject;
    },
    addTodo: function (text) {
      // Destructure
      const { todos, currentProject } = data;

      const id = todos[currentProject].length
        ? todos[currentProject][todos[currentProject].length - 1].id + 1
        : 1;
      // New todo
      const todo = new Todo(id, text);
      // Push new todo to current project array
      todos[currentProject].push(todo);

      return todo;
    },
    addSubTodo: function (text) {
      const { todos, currentTodo, currentProject } = data;
      const id = todos[currentProject].length
        ? todos[currentProject][todos[currentProject].length - 1].id + 1
        : 1;
      const todo = new Todo(id, text, currentTodo.id);
      todos[currentProject].push(todo);

      return todo;
    },
    getTodoById: function (id) {
      const todo = data.todos[data.currentProject].filter(
        (todo) => todo.id === id
      )[0];
      return todo;
    },
    setCurrentTodo: function (todo) {
      data.currentTodo = todo;
    },
    setDeleteTodo: function (todo) {
      data.deleteTodo = todo;
    },
    getCurrentTodo: function () {
      return data.currentTodo;
    },
    getDeleteTodo: function () {
      return data.deleteTodo;
    },
    deleteTodo: function (id) {
      const { todos, currentProject } = data;
      // Get ids
      const ids = todos[currentProject].map((todo) => todo.id);
      // Get index
      const index = ids.indexOf(id);
      // Remove todo
      todos[currentProject].splice(index, 1);
    },
    updateTodo: function (updatedTodo) {
      data.todos[data.currentProject].forEach((todo, index) => {
        if (updatedTodo.id === todo.id) {
          data.todos[data.currentProject].splice(index, 1, updatedTodo);
        }
      });
    },
    createProject: function (projectName) {
      data.todos[projectName] = [];
    },
    setCurrentProject: function (projectName) {
      data.currentProject = projectName;
    },
    deleteProject: function (projectName) {
      delete data.todos[projectName];
    },
  };
})();
