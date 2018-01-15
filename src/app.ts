import * as fromStore from './store';

// DOM manipulation
import { renderTodos } from './utils';

const input = document.querySelector('input') as HTMLInputElement;
const button = document.querySelector('button') as HTMLButtonElement;
const destroy = document.querySelector('.unsubscribe') as HTMLButtonElement;
const todoList = document.querySelector('.todos') as HTMLLIElement;

const reducers = {
  todos: fromStore.reducer
}

/** The slice of state our `todos` reducer is responsible for
 * const state = {
 *  todos: {
 *   loaded: false,
 *   loading: false,
 *   data: []
 *  }
 * }
 */

// instantiate our store when the app is served up
const store = new fromStore.Store(reducers);

// add todo
button.addEventListener(
  'click',
  () => {
    if (!input.value.trim()) return;

    const todo = { label: input.value, complete: false };

    // dispatch
    store.dispatch(new fromStore.AddTodo(todo));

    input.value = '';
  },
  false
);

const unsubscribe = store.subscribe(state => renderTodos(state.todos.data));

// unsubscribe
destroy.addEventListener('click', unsubscribe, false);

// delete
todoList.addEventListener('click', function(event) {
  const target = event.target as HTMLButtonElement;
  if (target.nodeName.toLowerCase() === 'button') {
    const todo = JSON.parse(target.getAttribute('data-todo') as any);
    // dispatch
    store.dispatch(new fromStore.RemoveTodo(todo));
  }
});

store.subscribe(state => console.log(`STATE:`, state));
