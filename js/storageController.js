const StorageCtrl = (function () {
  const defaultList = { inbox: [], important: [] };
  return {
    storeTodo: function (todo, currentProject) {
      let todos;
      // Check if any todos in localStorage
      if (!localStorage.getItem('todos')) {
        todos = defaultList;
        // Push new todo
        todos[currentProject].push(todo);
        // Set localStorage
        localStorage.setItem('todos', JSON.stringify(todos));
      } else {
        // Get what is already in localStorage
        todos = JSON.parse(localStorage.getItem('todos'));
        // Push new todo
        todos[currentProject].push(todo);
        // Re-set localStorage
        localStorage.setItem('todos', JSON.stringify(todos));
      }
    },
    getTodos: function () {
      let todos;
      if (!localStorage.getItem('todos')) {
        todos = defaultList;
      } else {
        todos = JSON.parse(localStorage.getItem('todos'));
      }
      return todos;
    },
    updateTodo: function (updatedTodo, currentProject) {
      const todos = JSON.parse(localStorage.getItem('todos'));

      todos[currentProject].forEach((todo, index) => {
        if (updatedTodo.id === todo.id) {
          todos.splice(index, 1, updatedTodo);
        }
      });
      localStorage.setItem('todos', JSON.stringify(todos));
    },
    deleteTodo: function (id) {
      const todos = JSON.parse(localStorage.getItem('todos'));

      todos.forEach((todo, index) => {
        if (id === todo.id) {
          todos.splice(index, 1);
        }
      });
      localStorage.setItem('todos', JSON.stringify(todos));
    },
  };
})();
