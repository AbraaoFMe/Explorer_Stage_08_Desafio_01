const db = require("../database");
const AppError = require("../utils/AppError");
const MovieTagsController = require("./MovieTagsController");

const movieTagsController = new MovieTagsController();

class MovieNotesController {
    async create({ user_id, title, description, rating, movie_tags }) {
        if (!user_id || !title || !rating) {
            throw new AppError("Missing Data. Unable to register movie note.");
        }

        if (isNaN(rating) || rating < 0 || rating > 10) {
            throw new AppError("Rating must be a decimal number between 0 and 10");
        }

        // check if user is registered
        const checkUser = db("users").where({ id: user_id }).first();

        if (!checkUser) {
            throw new AppError("User not found.");
        }

        const [new_movie_note_id] = await db("movie_notes").insert({ user_id, title, description, rating })

        if (movie_tags) {
            movie_tags.map(async tag => {
                await movieTagsController.create(
                    {
                        note_id: new_movie_note_id,
                        user_id,
                        name: tag.trim()
                    })
            })
        }

        const new_note = await this.get(new_movie_note_id);
        return new_note;

    }

    async get(id) {
        const movie_note = await db("movie_notes").where({ id }).first();

        if (!movie_note) {
            throw new AppError("Movie note not found");
        }

        return await this.format(movie_note);
    }

    async getUserNotes(user_id) {
        let movie_notes = await db("movie_notes").where({ user_id });

        movie_notes = await Promise.all(movie_notes.map(async movie_note => await this.format(movie_note)));

        return movie_notes;
    }

    async format(movie_note) {
        const movie_tags = await movieTagsController.getNoteTags(movie_note.id);

        return {
            id: movie_note.id,
            title: movie_note.title,
            description: movie_note.description,
            rating: movie_note.rating,
            created_at: movie_note.created_at,
            updated_at: movie_note.updated_at,
            movie_tags
        };
    }

}

module.exports = MovieNotesController;