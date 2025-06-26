# MongoDB Workshop: Todo List App

Welcome to the MongoDB Workshop! In this hands-on session, you will:

- Set up a **MongoDB Atlas Cluster**
- Build a **Node.js backend** using Express and MongoDB
- Connect to your cluster from code
- Create a minimal **HTML frontend** to interact with your API

---

## Prerequisites

### 1. Node.js and npm

Install from [https://nodejs.org](https://nodejs.org)  
Required versions:

```bash
node -v   # >= 18.x
npm -v    # >= 9.x
```

### 2. MongoDB Atlas Account

Follow this official guide to create a free Atlas account:

-> [Create MongoDB Atlas Account](https://www.mongodb.com/docs/atlas/tutorial/create-atlas-account/)

## MongoDB Atlas Setup

Once logged in:

### 1. Create a Project

1. In the sidebar, click on "Project".
2. In the "Project" page, click on "New Project".
3. Name your project something like `Project 0` and click "Next".
4. Click on "Create Project" while leaving everything on default.

### 2. Create a Cluster

1. In the "Cluster" page, click on " + Create".
2. Choose the "Free" option.
3. Name your cluster something like `Cluster0`.
4. Select your preferred provider and region.
5. Check "Automate Security Setup" and "Preload sample dataset".
6. Click on "Create Deployment".

### 3. Create a Database User

1. In the "Overview" page, scroll down and click on "Get connection string" in the "Application Development" section.
2. Create a user with a **username** and **password**. (Save them).
   ![Creating database user](/readme-images/create-database-user.png)
3. Click on "Create database user".

### 4. Get Your Connection String

1. In the "Overview" page, scroll down to the "Application Development" section.
2. Click on the dropdown box under the "Application Development" and select "JavaScript / Node.js".
   ![Get connection string](/readme-images/get-connection-string.png).
3. Click on the "Get connection string".
4. Copy the `mongodb+srv://...` URI.

```
mongodb+srv://<dbusername>:<db_password>@cluster0.abcd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

## MongoDB Atlas Database Setup

Before writing any code, let’s manually create your database and collection inside MongoDB Atlas. This will help you understand the structure of MongoDB documents and collections visually using the Atlas UI.

MongoDB stores data in a structure like this:

- **Database** -> contains Collections
- **Collection** -> contains multiple Documents (each is like a JSON object)

### 1. Creating a Database

1. Go to your Atlas Cluster Dashboard and click on "Browse Collections".

2. Click on "Create Database".

- Database Name: `todoWorkshop`
- Collection Name: `todos`

3. Click "Create".

### 2. Manually Inserting a Test Document

1. Click into the `todos` collection.
2. CLick "Insert Document" to add a sample entry:

```json
{
  "title": "Sample Task",
  "done": false,
  "createdAt": { "$date": { "$numberLong": "1717754400000" } }
}
```

3. Click on "Insert".

> [!NOTE]
> You can see how MongoDB stores your documents in JSON format.

## Project Structure

This is what our project structure will look like for this workshop.

```
todo-app/
├── backend/
│   ├── index.js
│   ├── .env
│   └── package.json
├── frontend/
│   └── index.html
└── README.md
```

## Backend Setup

### 1. Initialize the Express Server

Open your CLI, input these comamnds:

```bash
mkdir backend
cd backend
npm init -y
```

This creates a new folder called `backend` and initializes it as a Node.js project with a default `package.json` file.

### (Optional) Create `.gitignore` file

If you are using github, it is best to create a `.gitignore` file to prevent committing large or sensitive files (e.g. `node_modules`)

Inside `backend` folder, create a `.gitignore` file.

Paste the following inside it:

```.gitignore
# Dependencies
node_modules

# yarn error logs
yarn-error.log

# Environment varibales
.env*
!.env*.example

# Code coverage
coverage
```

### 2. Install Dependencies

```bash
npm install express mongodb dotenv cors
npm install --save-dev nodemon
```

#### What each package does:

- `express`: A fast, minimal web framework for building APIs.
- `mongodb`: Official MongoDB driver to connect and interact with your database.
- `dotenv`: Loads environment variables from a `.env` file so we can keep secrets (like connection strings) out of our code.
- `cors`: Allows cross-origin requests so your frontend can talk to your backend.
- `nodemon`: Simple monitor script to run our Express server in development mode.

### 3. Update your package.json

Add a `dev` script under `scripts`:

```json
"scripts": {
  "dev": "nodemon index.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

### 4. Create Environment Configuration

Create a `.env` file inside the backend folder to securely store your MongoDB connection string.

Paste the following inside:

```.env
MONGODB_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/?retryWrites=true&w=majority
DB_NAME=todoWorkshop
```

- `MONGODB_URI`: how your app connects to the cloud database.
- `DB_NAME`: Tells your app which database to use inside that cluster. We use our created `todoWorkshop` database.

> [!NOTE]
> Replace `<your_username>` and `<your_password>` with your actual MongoDB Atlas database user credentials.

### 5. Create the Server

In this section, we’ll build a simple Express server that connects to your MongoDB Atlas cluster and exposes CRUD endpoints for a Todo List.

> [!NOTE]
> All code and files inside this section will be contained inside the `backend` directory.

1. Create a `index.js` file and paste the following code to import the required packages:

- `express`
- `cors`
- `mongodb`
- `dotenv`

```javascript
import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
```

2. In the same file, paste the following code to initialize the Express app and load `.env` variables

```javascript
const app = express();
const PORT = 3000;
const uri = process.env.MONGODB_URI;
const database = process.env.DB_NAME;

app.use(cors());
app.use(express.json());
```

#### Explanation:

- `app.use(cors())`: Allows your frontend (running separately) to make requests.

- `app.use(express.json())`: Allows you to send and receive JSON data in requests.

3. Create a MongoDB Client

```javascript
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
```

It uses the Atlas URI from your `.env` file to connect to the cloud database.

4. Connect to MongoDB Atlas.

```javascript
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
```

### 6. Testing the Server

In the CLI, run the following script to start the server:

```bash
npm run dev
```

Your server is running and connected if you see something like this in the CLI:

![Server Start Successfully](/readme-images/server-start-success.png)

#### Common Issue

If you encounter an issue similar to the image shown below:

![Syntax Error](/readme-images/commonjs-module-error.png)

To fix this issue you should add:

```json
{
  "type": "module" // Add this
}
```

to your `package.json` and restart the project.

## REST API Endpoints

Now that your server is running and connected, let’s define each API route.

### 1. Create a `routes/` directory and `todos.js`

The resulting structure will look like this:

```
backend/
├── index.js
├── routes/
│   └── todos.js
```

### 2. Create Router Handler

This file will contain the CRUD API endpoints for managing todo items in MongoDB. It receives the `todosCollection` (a MongoDB collection object) and returns a configured router.

Paste the following code into the `todos.js`:

> [!NOTE]
> Explanation can be found under the code snippet

```javascript
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
```

#### Explanation

**1. GET / – Fetch All Todos**

```javascript
router.get('/', async (req, res) => {
  const todos = await todosCollection.find().toArray();
  res.json(todos);
});
```

- Fetches all todo documents from the todos collection.
- Converts the result into an array using .toArray().
- Returns the data as a JSON array in the response.

**2. POST / – Create a New Todo**

```javascript
router.post('/', async (req, res) => {
  const newTodo = {
    title: req.body.title,
    done: false,
    createdAt: new Date(),
  };
  const result = await todosCollection.insertOne(newTodo);
  res.json(result);
});
```

- Receives a JSON body (from the frontend) with a `title` field.
- Constructs a new todo document with default values:
  - `done`: `false`
  - `createdAt`: current timestamp
- Inserts the new document into the collection using `insertOne()`.
- Returns the result (including the inserted ID).

**3. PUT /:id – Update Todo Status**

```javascript
router.put('/:id', async (req, res) => {
  const result = await todosCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { done: req.body.done } }
  );
  res.json(result);
});
```

- Extracts the document ID from the URL and converts it to a MongoDB `ObjectId`.
- Updates the `done` field of that specific document using `$set`.
- Returns the result (number of modified documents, etc.).

**4. DELETE /:id – Delete a Todos**

```javascript
router.delete('/:id', async (req, res) => {
  const result = await todosCollection.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  res.json(result);
});
```

- Reads the document ID from the URL and converts it into an `ObjectId`.
- Removes the matching document using `deleteOne()`.
- Sends back the result, showing if a document was deleted.

#### Summary

| Method | Endpoint     | Purpose              |
| ------ | ------------ | -------------------- |
| GET    | `/todos`     | Fetch all todos      |
| POST   | `/todos`     | Create a new todo    |
| PUT    | `/todos/:id` | Update a todo status |
| DELETE | `/todos/:id` | Delete a todo        |

## Frontend Integration with MongoDB

### 1. Create a `frontend` directory and `index.html`

The resulting structure will look like this:

```
frontend/
├── index.html << Newly added file
backend/
├── index.js
├── routes/
│   └── todos.js
```

### 2.
