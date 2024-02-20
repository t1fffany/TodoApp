const express = require("express");
const app = express();
const PORT = 3000;
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json()); //req.body

// POST: Create a User - tested
app.post("/users", async (req, res) => {
    try {
        const { username, password_hash, email } = req.body;
        const newUser = await pool.query(
            "INSERT INTO USERS (username, password_hash, email) VALUES($1, $2, $3) RETURNING *",
            [username, password_hash, email]
        );
        res.json(newUser.rows);
    } catch (err) {
        console.error(err.message);
        res.status(400).send("Unable to create new user");
    }
});

// POST: Create a TodoList - tested
app.post("/todoLists/:userId", async(req, res) => {
    try {
        const { userId } = req.params;
        const { title } = req.body;
        const newList = await pool.query(
            "INSERT INTO TODO_LISTS (user_id, title) VALUES($1, $2) RETURNING *",
            [userId, title]
        );
        res.json(newList.rows);
    } catch (err) {
        console.error(err.message);
        res.status(400).send("Could not store item into database");
    }
});

// GET: Get all of the TodoLists - tested
app.get("/todoLists/:userId", async(req, res) => {
    try {
        const { userId } = req.params;
        const allTodoLists = await pool.query(
            "SELECT * FROM TODO_LISTS WHERE user_id = $1",
            [userId]
        );
        res.json(allTodoLists.rows);
    } catch (err) {
        console.error(err.message);
        res.status(404).send("Error retrieving item");
    }
});

// POST: Create a TodoItem for a specific list - tested
app.post("/todoItem/:listId", async(req, res) => {
    try {
        const { listId } = req.params;
        const { content, due_date } = req.body;
        const newTodoItem = await pool.query(
            "INSERT INTO TODO_ITEMS (todo_list_id, content, due_date) VALUES($1, $2, $3) RETURNING *",
            [listId, content, due_date]
        );
        res.json(newTodoItem.rows);
    } catch (err) {
        console.error(err.message);
        res.status(400).send("Could not store item into database");
    }
});

// GET: Get all the TodoItem's in the TodoList - tested
app.get("/todoItems/:listId", async (req, res) => {
    try {
        const { listId } = req.params;
        const allTodoItems = await pool.query(
            "SELECT * FROM TODO_ITEMS WHERE todo_list_id = $1",
            [listId]
        );
        res.json(allTodoItems.rows);
    } catch (err) {
        console.error(err.message);
        res.status(404).send("Server Error");
    }
});

// PUT:    Update a TodoItem and mark it as done
app.put("/todoItems/:itemId", async (req, res) => {
    try {
        const { itemId } = req.params;
        const updateTodoItem = await pool.query(
            "UPDATE TODO_ITEMS SET is_completed = TRUE WHERE id = $1 RETURNING *",
            [itemId]
        );
        res.json(updateTodoItem.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// DELETE: Delete a TodoListItem - tested
app.delete("/todoItems/:itemId", async (req, res) => {
    try {
        const { itemId } = req.params;
        await pool.query("DELETE FROM TODO_ITEMS WHERE id = $1", [itemId]);
        res.json("TodoItem deleted");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// DELETE: Delete a TodoList - tested
app.delete("/todoLists/:listId", async (req, res) => {
    try {
        const { listId } = req.params;

        await pool.query("DELETE FROM Todo_Lists WHERE id = $1", [listId]);

        res.json("TodoList deleted");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});