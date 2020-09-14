const AppCtrl = (function () {
  return {
    init: function () {
      const todos = ItemCtrl.getTodos();
      UICtrl.populateTodoList(todos);
      const projects = ItemCtrl.getProjects();
      UICtrl.populateProjectsList(projects);
    },
  };
})();

AppCtrl.init();
