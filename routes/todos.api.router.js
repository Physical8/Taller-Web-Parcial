const router = require("express").Router();
const { connectClient } = require("../db/postgres");
const todoModel = require("../src/models/todoModel");

// Index
router.get("/", async (req, res) => {
    try {
        const todos = await todoModel.findAll();
        res.json(todos);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// STORE CON SEQUELIZE
// Store
router.post("/", async (req, res) => {
    try {
        const { title, completed } = req.body;
        await todoModel.create({ title, completed });
        res.status(201).send("Todo created");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// ------------------- // Store
// router.post("/", async (req, res) => {
//     const client = await connectClient();
//     try {
//         const { title, completed } = req.body;
//         await client.query("INSERT INTO todos (title, completed) VALUES ($1, $2)", [
//             title,
//             completed,
//         ]);
//         res.status(201).send("Todo created");
//     } catch (error) {
//         res.status(500).send(error.message);
//     } finally {
//         await client.end();
//     }
// });

// SHOW CON SEQUELIZE
// Show V1
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await todoModel.findOne({
            where: {
                id: id
            }
        });

        if (!todo) {
            return res.status(404).send("Todo not found");
        }

        res.json(todo);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// Show V2
// router.get("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const todo = await todoModel.findByPk(id);
//         if (!todo) {
//             return res.status(404).send("Todo not found");
//         }
//         res.json(todo);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// // Show
// router.get("/:id", async (req, res) => {
//     const client = await connectClient();
//     try {
//         const { id } = req.params;
//         const result = await client.query("SELECT * FROM todos WHERE id = $1", [
//             id,
//         ]);
//         if (result.rows.length === 0) {
//             return res.status(404).send("Todo not found");
//         }
//         res.json(result.rows[0]);
//     } catch (error) {
//         res.status(500).send(error.message);
//     } finally {
//         await client.end();
//     }
// });

// UPDATE CON SEQUELIZE
// Update
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        const updated_at = new Date();
        
        const [updated] = await todoModel.update(
            { title, completed, updated_at },
            {
                where: { id }
            }
        );

        if (updated === 0) {
            return res.status(404).send("Todo not found");
        }
        
        res.send("Todo updated");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// // Update
// router.put("/:id", async (req, res) => {
//     const client = await connectClient();
//     try {
//         const { id } = req.params;
//         const { title, completed } = req.body;
//         const updated_at = new Date();
//         const result = await client.query(
//             "UPDATE todos SET title = $1, completed = $2, updated_at = $3 WHERE id = $4",
//             [title, completed, updated_at, id]
//         );
//         if (result.rowCount === 0) {
//             return res.status(404).send("Todo not found");
//         }
//         res.send("Todo updated");
//     } catch (error) {
//         res.status(500).send(error.message);
//     } finally {
//         await client.end();
//     }
// });

// DELETE CON SEQUELIZE
// Delete
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleted = await todoModel.destroy({
            where: { id }
        });

        if (deleted === 0) {
            return res.status(404).send("Todo not found");
        }
        
        res.send("Todo deleted");
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// // Delete
// router.delete("/:id", async (req, res) => {
//     const client = await connectClient();
//     try {
//         const { id } = req.params;
//         const result = await client.query("DELETE FROM todos WHERE id = $1", [id]);
//         if (result.rowCount === 0) {
//             return res.status(404).send("Todo not found");
//         }
//         res.send("Todo deleted");
//     } catch (error) {
//         res.status(500).send(error.message);
//     } finally {
//         await client.end();
//     }
// });

module.exports = router;
