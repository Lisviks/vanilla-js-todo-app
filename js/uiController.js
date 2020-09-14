const UICtrl = (function () {
  const UISelectors = {
    todoList: '#todo-list',
    todoForm: '#todo-form',
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
  };
})();
