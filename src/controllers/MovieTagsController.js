const db = require("../database");

class MovieNotesController {
    async create({ note_id, user_id, name }) {
        await db("movie_tags").insert({ note_id, user_id, name });
    }

    async getNoteTags(note_id) {
        let tags = await db("movie_tags").select("name").where({ note_id }).orderBy("name");

        tags = tags.map(tag => tag.name);

        return tags || [];
    }
}

module.exports = MovieNotesController;