const { hash } = require("bcryptjs");
const HASH_SALT = 8;

const db = require("../database");
const AppError = require("../utils/AppError");

const MovieNotesController = require("./MovieNotesController");
const movieNotesController = new MovieNotesController();

class UsersController {
    async create(name, email, password, avatar = 'default.png') {

        // check email
        const emailAlreadyInUse = await db("users").where({ email }).first();

        if (emailAlreadyInUse) {
            throw new AppError("Email is already registered.");
        }

        // hash password
        const hashedPassword = await hash(password, HASH_SALT);

        const [new_user_id] = await db("users").insert({
            name,
            email,
            password,
            avatar
        });

        const new_user = await this.get(new_user_id);

        return new_user;
    }

    async get(id) {
        const user = await db("users").where({ id }).first();

        if (!user) {
            throw new AppError("User is not registered.")
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at
        }
    }

    async getNotes(id) {
        // check user
        const userExists = await db("users").where({ id }).first();

        if(!userExists) {
            throw new AppError("User is not registered.");
        }

        const notes = await movieNotesController.getUserNotes(id);
        return notes;
    }
}

module.exports = UsersController;