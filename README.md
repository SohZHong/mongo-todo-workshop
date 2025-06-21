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
