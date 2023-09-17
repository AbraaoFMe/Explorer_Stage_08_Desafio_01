const { Router, response, request } = require("express");
const AppError = require("../utils/AppError");
const UsersController = require("../controllers/UsersController");

const usersController = new UsersController();

const usersRoutes = Router()

usersRoutes.post("/", async (request, response) => {
    const { name, email, password, avatar } = request.body.user;

    if (!name || !email || !password) {
        throw new AppError("Missing data. Unable to register new user.")
    }

    // try call method to create user
    const new_user = await usersController.create(name, email, password);

    return response.json(new_user)
});

usersRoutes.get("/:id", async (request, response) => {
    const { id } = request.params;

    const user = await usersController.get(id);

    return response.json(user);
});

usersRoutes.get("/:id/notes", async (request, response) => {
    const { id } = request.params;

    const notes = await usersController.getNotes(id);

    return response.json(notes);
});

module.exports = usersRoutes;