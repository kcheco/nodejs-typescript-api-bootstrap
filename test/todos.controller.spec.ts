import TodoController from '../src/domain/todo.controller';
import TodoRepository from '../src/domain/todo.repository';
import TodoService from '../src/domain/todo.service';

describe('TodosController', () => {
  let todosController: TodoController;

  beforeEach(() => {
    const todosRepository = new TodoRepository();
    const todosService = new TodoService(todosRepository);
    todosController = new TodoController(todosService);
  })

  it ('creates controller', () => {
    expect(todosController).toBeTruthy();
  });
});