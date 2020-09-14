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
    currentList: 'inbox',
  };

  return {
    getTodos: function () {
      return data.todos[data.currentList];
    },
    getProjects: function () {
      return Object.keys(data.todos);
    },
  };
})();
