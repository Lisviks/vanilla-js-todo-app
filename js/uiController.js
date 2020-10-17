const UICtrl = (function () {
  const UISelectors = {
    todoList: '#todo-list',
    todoListItem: '.todo-list-item',
    todoForm: '#todo-form',
    subTodoForm: '#sub-todo-form',
    subTodoList: '#sub-todo-list',
    projectList: '#project-list',
    deleteBtn: '.delete-btn',
    todoModal: '.todo-modal',
    deleteModal: '.delete-modal',
    newProjectForm: '#new-project-form',
    projectItemWrapper: '.project-item-wrapper',
    commentsList: '.comments-list',
    commentsForm: '.comments-form',
  };

  // Todo html list item
  const todoItem = (todo) => {
    const listItem = li(
      { class: 'todo-list-item', ['data-todo_id']: todo.id },
      div(
        { class: 'todo' },
        input({
          type: 'checkbox',
          class: 'checkbox',
          checked: todo.complete,
        }),
        span({ class: 'todo-text' }, todo.text)
      ),
      button({ class: 'delete-btn' }, 'X')
    );

    return listItem;
  };

  // Project html list item
  const projectItem = (project) => {
    // Capitalize first letter
    const projectTitle = project.charAt(0).toUpperCase() + project.slice(1);

    const listItemWrapper = li(
      { class: 'project-item-wrapper' },
      div(
        {
          id: project.toLowerCase(),
          class: project === 'inbox' ? 'navbar-item active' : 'navbar-item',
        },
        projectTitle
      ),
      // Check if project is inbox or important,
      // then don't add delete button
      project !== 'important' &&
        project !== 'inbox' &&
        button({ class: 'delete-btn' }, 'X')
    );

    return listItemWrapper;
  };

  const commentItem = function (comment) {
    const listItem = li(
      { class: 'comment-list-item', ['data-comment_id']: comment.id },
      div(
        { class: 'comment' },
        span({ class: 'comment-content' }, comment.text)
      ),
      button({ class: 'delete-btn' }, 'X')
    );

    return listItem;
  };

  return {
    populateTodoList: function (todos, listToPopulate = 'todoList') {
      const todoList = document.querySelector(UISelectors[listToPopulate]);
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
    populateCommentsList: function (comments) {
      const commentsList = document.querySelector(UISelectors.commentsList);
      comments.length
        ? comments.forEach((comment) =>
            commentsList.appendChild(commentItem(comment))
          )
        : (commentsList.innerHTML =
            '<h3 class="no-comments">No comments...</h3>');
    },
    getSelectors: function () {
      return UISelectors;
    },
    getTodoText: function (form = 'todoForm') {
      return document.querySelector(UISelectors[form])['form-text'].value;
    },
    clearForm: function (formToClear) {
      // formToClear - todoForm, subTodoForm, newProjectForm
      document.querySelector(UISelectors[formToClear])['form-text'].value = '';
    },
    addTodo: function (todo, todoList = 'todoList') {
      const list = document.querySelector(UISelectors[todoList]);
      list.appendChild(todoItem(todo));
    },
    updateTodo: function (todo) {
      const allTodos = document.querySelectorAll(UISelectors.todoListItem);
      allTodos.forEach((todoEl) => {
        if (parseInt(todoEl.dataset.todo_id) === todo.id) {
          todoEl.querySelector('.todo-text').innerText = todo.text;
        }
      });
    },
    addComment: function (commentObj) {
      const comment = commentItem(commentObj);
      document.querySelector(UISelectors.commentsList).appendChild(comment);
    },
    deleteComment: function (id) {
      const comment = document.querySelector(`[data-comment_id='${id}']`);
      comment.remove();
    },
    clearCommentForm: function () {
      document.querySelector(UISelectors.commentsForm)['form-text'].value = '';
    },
    enableInput: function (input) {
      input.disabled = false;
      input.focus();
    },
    disableInput: function (input) {
      input.disabled = true;
    },
    getEditTodoText: function (input) {
      return input.value;
    },
    deleteConfirmModal: function (itemToDeleteText) {
      const modal = div(
        { class: 'modal delete-modal' },
        div(
          { class: 'modal-content' },
          p({}, `Are you sure you want to delete "${itemToDeleteText}"?`),
          div(
            { class: 'dialog-actions' },
            button({ class: 'modal-cancel-btn btn' }, 'Cancel'),
            button({ class: 'modal-delete-btn btn' }, 'Delete')
          )
        )
      );

      $('body').appendChild(modal);

      return modal;
    },
    subTasksTab: function () {
      const subTodoTabContent = div(
        { class: 'sub-todo-tab-content' },
        ul({ class: 'todo-list', id: 'sub-todo-list' }),
        form(
          { class: 'todo-form', id: 'sub-todo-form' },
          div(
            { class: 'input-field' },
            input({
              type: 'text',
              class: 'todo-text',
              id: 'form-text',
              autocomplete: 'off',
            })
          ),
          button({ type: 'submit', class: 'add-btn btn' }, 'Add Task')
        )
      );

      return subTodoTabContent;
    },
    commentsTab: function () {
      const commentsTabContent = div(
        { class: 'comments-tab-content' },
        ul({ class: 'comments-list' }),
        form(
          { class: 'comments-form' },
          div(
            { class: 'input-field' },
            input({
              type: 'text',
              class: 'comment-text',
              id: 'form-text',
              autocomplete: 'off',
            })
          ),
          button({ type: 'submit', class: 'add-btn btn' }, 'Add Comment')
        )
      );

      return commentsTabContent;
    },
    todoModal: function (todo, currentProject, tab) {
      const modal = div(
        { class: 'modal todo-modal' },
        div(
          { class: 'modal-content' },
          div(
            { class: 'todo-modal-header' },
            span(
              {},
              currentProject.charAt(0).toUpperCase() + currentProject.slice(1)
            ),
            button({ class: 'close-modal-btn' }, 'X')
          ),
          div(
            { class: 'todo', ['data-todo_id']: todo.id },
            input({
              type: 'checkbox',
              class: 'checkbox',
              checked: todo.complete,
            }),
            input({
              type: 'text',
              class: 'todo-text',
              value: todo.text,
              disabled: true,
            })
          ),
          div(
            { class: 'todo-modal-tab-list' },
            button(
              { class: 'todo-modal-sub-tasks-tab tab-btn active' },
              'Sub-tasks'
            ),
            button({ class: 'todo-modal-comments-tab tab-btn' }, 'Comments')
          ),
          div({ class: 'tab-content' }, tab)
        )
      );

      $('body').appendChild(modal);

      return modal;
    },
    closeModal: function (modalToClose) {
      // modalToClose - todoModal, deleteModal
      document.querySelector(UISelectors[modalToClose]).remove();
    },
    removeTodo: function (id) {
      const todo = document.querySelector(`[data-todo_id='${id}']`);
      todo.remove();
    },
    getNewProjectName: function () {
      const newProjectForm = document.querySelector(UISelectors.newProjectForm);
      return newProjectForm['project-name'].value;
    },
    addProject: function (projectName) {
      const project = projectItem(projectName);
      document.querySelector(UISelectors.projectList).appendChild(project);
    },
    clearNewProjectForm: function () {
      document.querySelector(UISelectors.newProjectForm)['project-name'].value =
        '';
    },
    changeProject: function (projectName) {
      const projects = document.querySelectorAll(
        UISelectors.projectItemWrapper
      );
      projects.forEach((project) => {
        const div = project.querySelector('div');
        if (div.id === projectName) {
          div.classList.add('active');
        } else {
          div.classList.remove('active');
        }
      });
    },
    removeProject: function (projectName) {
      const projects = document.querySelectorAll(
        UISelectors.projectItemWrapper
      );
      projects.forEach((project) => {
        const div = project.querySelector('div');
        if (div.id === projectName) {
          project.remove();
        }
      });
    },
  };
})();
