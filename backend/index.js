import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 3000;
const uri = process.env.MONGODB_URI;
const database = process.env.DB_NAME;

app.use(cors());
app.use(express.json());
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
let todosCollection;

// Connect the client to the server
await client
  .connect()
  .then(async () => {
    // Start app at designated PORT
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );

    // Create instance of our todoWorkshop database and todos collection
    const db = client.db(database);
    todosCollection = db.collection('todos');
  })
  .catch(console.error);
