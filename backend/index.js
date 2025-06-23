import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI, {
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
    const db = client.db(process.env.DB_NAME);
    todosCollection = db.collection('todos');
  })
  .catch(console.error)
  .finally(
    // Ensures that the client will close when you finish/error
    await client.close()
  );
