import logger from '../utilities/logger';
import { Request, Response } from 'express';
import Todo from './todo.model';
import TodoService from './todo.service';
import TodoRepository from './todo.repository';
import { NextFunction } from 'connect';

export default class TodoController {
  /**
   * The service utilized to communicate message requests to and
   * from data layer
   * 
   * @private
   * @property
   */
  private readonly _service: TodoService;
  
  /**
   * the default set up when instance is created
   * 
   * @param service the default service for an instance of this 
   * controller
   */
  constructor(service: TodoService) {
    this._service = service;
  };

  /**
   * Receives a request from the router to get a list of todos
   * 
   * @param _ Request
   * @param res Response
   * 
   * @returns Promise<void>
   */
  public async getList(req: Request, res: Response) : Promise<void> {
    return await this._service.getAllTodos()
      .then((todos) => {
        logger.info('GET /api/todos successful call to retrieve all todos');
        logger.info('Received response:');
        logger.info(`${todos}`);
        res.json(todos);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  /**
   * Receives a request from router to find a specific todo
   * 
   * @param req Request
   * @param res Response
   * 
   * @returns Promise<void>
   */
  public async findTodo(req: Request, res: Response, next: NextFunction) : Promise<void> {
    const id = req.params.id;

    return await this._service.findOneTodo(id)
      .then((todo) => {
        logger.info(`GET /api/todos/%s successful call to retrieve todo`, req.params.id);

        if(!todo || todo === null) {
          throw new Error(`Todo with id ${req.params.id} does not exist.`);
          next();
        }

        logger.info(`${todo}`);
        res.json(todo);
      })
      .catch((error) => {
        logger.error(error);
        res.status(500).json({error: error});
      });
  }

  /**
   * Receives a request from router to create a new todo
   * 
   * @param req Request
   * @param res Response
   * 
   * @returns Promise<void>
   */
  public async createTodo(req: Request, res: Response) : Promise<void> {
    const todo = new Todo({
      task: req.query.task,
      completed: req.query.completed || false,
    });

    logger.info(`POST /api/todos successfully called to create a new todo`);
    logger.info(`Params: %s`, JSON.stringify(req.query));

    return await this._service.createNewTodo(todo)
      .then((createdTodo) => {
        logger.info(`Todo created successfully`);
        logger.info(`${ createdTodo.toJSON }`);
        res.status(201).json(createdTodo);
      })
      .catch((error) => {
        logger.error(error);
        res.status(422).json({error: error});
      });
  }

  /**
   * Receives request from router to update a todo
   * 
   * @param req Request
   * @param res Response
   * 
   * @returns Promise<void>
   */
  public updateTodo(req: Request, res: Response, next: NextFunction) : Promise<void> {
    const id = req.params.id;
    const updateValue = new Todo({
      _id: id,
      task: req.query.task,
      completed: req.query.completed,
    });

    logger.info(`PUT /api/todos/${ id } successfully called`);
    logger.info(`Params: %s`, JSON.stringify(req.query));
    
    return this._service.updateExistingTodo(id, updateValue)
      .then((completed) => {
        if (!completed) {
          logger.error('There appears to be a problem after calling todosController.updateTodo');
          throw new Error('There appears to be a problem after calling todosController.updateTodo');
          next();
        }

        logger.info(`Todo id ${ id } updated`);
        res.status(200).json({
          success: true,
          message: `Todo id ${ id } updated successfully`
        });
      })
      .catch((error) => {
        logger.error(error);
        res.status(422).json({error: error});
      });
  }

  /**
   * Receives request from router to delete a todo
   * 
   * @param req Request
   * @param res Response
   * 
   * @returns Promise<void>
   */
  public deleteTodo(req: Request, res: Response, next: NextFunction) : Promise<void> {
    const id = req.params.id;

    logger.info(`DELETE /api/todos/${ id } successfully called`);
    logger.info(`Params: %s`, JSON.stringify(req.params));
    
    return this._service.deleteOneTodo(id)
      .then((completed) => {
        if (!completed) {
          logger.error('There appears to be a problem after calling todosController.deleteTodo');
          throw new Error('There appears to be a problem after calling todosController.deleteTodo');
          next();
        }

        logger.info(`Todo id ${ id } removed`);
        res.status(200).json({
          success: true,
          message: `Todo id ${ id } removed successfully`
        });
      })
      .catch((error) => {
        logger.error(error);
        res.status(401).json({error: error});
      });
  }
}

/**
 * A factory for creating a new TodoController along with its dependencies
 */
export const createTodoController = () : TodoController => {
  const repo = new TodoRepository();
  const service = new TodoService(repo);
  const controller = new TodoController(service);

  return controller;
}
