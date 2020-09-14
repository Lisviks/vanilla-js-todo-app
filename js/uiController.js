const UICtrl = (function () {
  const UISelectors = {
    todoList: '#todo-list',
    todoForm: '#todo-form',
    projectList: '#project-list',
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

    const todoText = document.createElement('input');
    todoText.type = 'text';
    todoText.classList = 'todo-text';
    todoText.value = todo.text;
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
    listItemWrapper.classList = 'list-item-wrapper';

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
    populateTodoList: function (todos) {
      const todoList = document.querySelector(UISelectors.todoList);
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
    getTodoText: function () {
      return document.querySelector(UISelectors.todoForm)['todo-text'].value;
    },
    clearTodoForm: function () {
      document.querySelector(UISelectors.todoForm)['todo-text'].value = '';
    },
    addTodo: function (todo) {
      const todoList = document.querySelector(UISelectors.todoList);
      todoList.appendChild(todoItem(todo));
    },
  };
})();
