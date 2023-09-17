const { Router, request, response } = require("express")
const MovieNotesController = require("../controllers/MovieNotesController");

const notesRouter = Router();
const movieNotesController = new MovieNotesController();

notesRouter.post("/", async (request, response) => {
    const { title, description, rating, movie_tags } = request.body.movie_note;
    const { user_id } = request.body;

    const new_note = await movieNotesController.create({ user_id, title, description, rating, movie_tags });

    return response.status(201).json(new_note);
});

notesRouter.get("/:id", async (request, response) => {
    const { id } = request.params;

    const note = await movieNotesController.get(id);

    return response.json(note);
})

module.exports = notesRouter;