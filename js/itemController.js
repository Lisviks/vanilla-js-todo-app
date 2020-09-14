const ItemCtrl = (function () {
  // Todo constructor
  const Todo = function (id, text) {
    this.id = id;
    this.text = text;
    this.complete = false;
  };

  // Data Structure / State
  const data = {
    todos: StorageCtrl.getTodos(),
    currentProject: 'inbox',
  };

  return {
    getTodos: function () {
      return data.todos[data.currentProject];
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
  };
})();
