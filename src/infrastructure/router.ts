import TodoController, { createTodoController } from '../domain/todo.controller';
import express from 'express';

// TODO: work on decoupling router from controller object(s)

class Router {
  /**
   * The express routing middleware
   * 
   * @private
   * @property
   */
  private _router: express.Router;

  /**
   * The controller that will handle the requests
   * 
   * @private
   * @property
   */
  private _controller: TodoController;

  /**
   * sets controller when new instance is created
   */
  constructor() {
    const initializedController = createTodoController();
    this._controller = initializedController;
  }

  /**
   * Initializes the express router and maps application routes
   * 
   * @returns express.Router
   */
  public init(): express.Router {
    this._router = express.Router();
    this.mapRoutes();

    return this._router;
  }

  /**
   * Define all routes the application will use
   * 
   * @returns void
   */
  private mapRoutes(): void {
    this._router.get('/', (req, res) => {
      res.json('Hello World!');
    });

    // define routes
    this._router.route('/api/todos')
      .get(this._controller.getList.bind(this._controller))
      .post(this._controller.createTodo.bind(this._controller))

    this._router.route('/api/todos/:id')
      .get(this._controller.findTodo.bind(this._controller))
      .put(this._controller.updateTodo.bind(this._controller))
      .delete(this._controller.deleteTodo.bind(this._controller))
  }
}

export default Router;
