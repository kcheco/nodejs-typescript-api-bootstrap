import Todo, { ITodoDocument } from './todo.model';
import { Model } from 'mongoose';

export default class TodoRepository {
  /**
   * The model object used by the repository
   * 
   * @private
   * @property
   */
  private _model: Model<ITodoDocument>;

  /**
   * Initializes with the model object
   * 
   * @param model (optional)
   */
  constructor(model?: Model<ITodoDocument>) {
    this._model = model || Todo;
  }

  /**
   * Calls on the persistance layer to save a todo
   * 
   * @param attributes 
   * 
   * @returns ITodoDocument
   */
  public async create(attributes: ITodoDocument) : Promise<ITodoDocument> {
    const result = await this._model.create(attributes);

    return result;
  }

  /**
   * Calls on the persistence layer to apply changes to a todo
   * 
   * @param id 
   * @param attributes 
   * 
   * @returns any
   */
  public async update(id: string, attributes: ITodoDocument) : Promise<any> {
    const result = await this._model.updateOne({_id: id}, attributes);

    return result;
  }

  /**
   * Calls on the persistence layer to find a todo
   * 
   */
  public async find() : Promise<ITodoDocument[]>{
    return this._model.find();
  }

  /**
   * Calls on the persistence layer to find a specific todo
   * 
   * @param id 
   * 
   * @returns ITodoDocument
   */
  public async findOne(id: string) : Promise<ITodoDocument> {
    const result = await this._model.findOne({_id: id.toString()});

    return result;
  }

  /**
   * Calls on persistence layer to remove a todo
   * 
   * @param id 
   * 
   * @returns boolean
   */
  public async delete(id: string): Promise<boolean> {
    const result = await this._model.deleteOne({_id: id});
    return !!result.ok;
  }
}
