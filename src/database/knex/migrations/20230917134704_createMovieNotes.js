exports.up = knex => knex.schema.createTable("movie_notes", table => {
    table.increments("id");
    table.text("title");
    table.text("description");
    table.integer("rating");

    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");

    const current_timestamp = knex.fn.now();

    table.timestamp("created_at").default(current_timestamp);
    table.timestamp("updated_at").default(current_timestamp);
});

exports.down = knex => knex.schema.dropTable("movie_notes");
