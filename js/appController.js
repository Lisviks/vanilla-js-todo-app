const AppCtrl = (function () {
  return {
    init: function () {
      const todos = ItemCtrl.getTodos();
      UICtrl.populateTodoList(todos);
    },
  };
})();

AppCtrl.init();
