import TodoRepository from './todo.repository';
import { ITodoDocument } from './todo.model';

export default class TodoService {
  /**
   * The repository utilized to persist and query Todo objects
   *
   * @private
   * @property
   */
  private _repository: TodoRepository;

  /**
   * Creates a new instance of the service
   *
   * @param repository the repository required when service is
   * instantiated
   */
  constructor(repository: TodoRepository) {
    this._repository = repository;
  }

  /**
   * Retrieves a list of todos from repository
   *
   * @returns Promise<ITodoDocument[]>
   */
  public async getAllTodos(): Promise<ITodoDocument[]> {
    return await this._repository.find();
  }

  /**
   * Accepts a todo and sends Todo to repository for persistance
   *
   * @param todo a model object being sent to repository
   *
   * @returns Promise<ITodoDocument>
   */
  public async createNewTodo(todo: ITodoDocument): Promise<ITodoDocument> {
    return await this._repository.create(todo);
  }

  /**
   * Accepts the id of a todo object and sends data to repository for updating
   * and persisting changes
   *
   * @param id the identifier for the object being updated
   * @param todo a todo object with the data being sent to repository
   * for updating
   *
   * @returns Promise<any>
   */
  public async updateExistingTodo(id: string, todo: ITodoDocument): Promise<any> {
    return await this._repository.update(id, todo);
  }

  /**
   * Retrieves a specific todo from the repository
   *
   * @param id the identifier for the object being looked up
   *
   * @returns Promise<ITodoDocument>
   */
  public async findOneTodo(id: string): Promise<ITodoDocument> {
    return await this._repository.findOne(id);
  }

  /**
   * Receives message from repository when a specific todo is being
   * deleted
   *
   * @param id the identifier for the object being deleted
   *
   * @returns Promise<boolean>
   */
  public async deleteOneTodo(id: string): Promise<boolean> {
    return await this._repository.delete(id);
  }
}
