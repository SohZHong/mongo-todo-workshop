import express from 'express';
import { ObjectId } from 'mongodb';

export default function todoRoutes(todosCollection) {
  const router = express.Router();

  // GET all todos
  router.get('/', async (req, res) => {
    const todos = await todosCollection.find().toArray();
    res.json(todos);
  });

  // POST new todos
  router.post('/', async (req, res) => {
    const newTodo = {
      title: req.body.title,
      done: false,
      createdAt: new Date(),
    };
    const result = await todosCollection.insertOne(newTodo);
    res.json(result);
  });

  // PUT update todo
  router.put('/:id', async (req, res) => {
    const result = await todosCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { done: req.body.done } }
    );
    res.json(result);
  });

  // DELETE todo
  router.delete('/:id', async (req, res) => {
    const result = await todosCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.json(result);
  });

  return router;
}
