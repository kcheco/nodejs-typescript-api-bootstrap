import mongoose from 'mongoose';

export interface ITodoDocument extends mongoose.Document {
  task: string;
  completed: boolean;
}

const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
}, {
  timestamps: true,
});

const Todo = mongoose.model<ITodoDocument>('Todo', todoSchema);

export default Todo;
