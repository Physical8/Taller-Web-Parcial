const router = require("express").Router();
const Todo = require("../src/models/todoModel");

// Index - Para mostrar todas las tareas
router.get("/", async (req, res) => {
    try {
        const todos = await Todo.findAll();
        res.render('todos/index', { todos });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Ruta para mostrar el formulario de creación
router.get('/create', (req, res) => {
    res.render('todos/create');
});

// Store - Para crear una nueva tarea
router.post("/", async (req, res) => {
    try {
        const { title, completed } = req.body;
        await Todo.create({ title, completed: completed == 'on' ? true : false });
        res.redirect('/todospanel');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Edit - Para mostrar formulario que permita editar una tarea
router.get("/:id/edit", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByPk(id);
        if (!todo) {
            return res.status(404).send("Todo not found");
        }
        res.render('todos/edit', { todo });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Edit - Para actualizar una tarea
router.post("/:id/edit", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        const todo = await Todo.findByPk(id);
        if (!todo) {
            return res.status(404).send("Todo not found");
        }
        await todo.update({ title, completed: completed == 'on' ? true : false });
        res.redirect('/todospanel');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Show - Para ver los detalles de una tarea
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByPk(id);
        if (!todo) {
            return res.status(404).send("Todo not found");
        }
        res.render('todos/details', { todo });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete - Para eliminar una tarea
router.post("/:id/delete", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByPk(id);
        if (!todo) {
            return res.status(404).send("Todo not found");
        }
        await todo.destroy();
        res.redirect('/todospanel');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
