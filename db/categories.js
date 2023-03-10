// categories db functions

const { client } = require("./index");


/**
 ** Create Category
 * Inserts a new category into the database categories table - unless a category with that name already exists.
 * @param { string } name the name of the category
 * @returns { object } the newly created category
 */
async function createCategory({ name }) {
  try {
    const { rows: [ category ] } = await client.query(`
      INSERT INTO categories(name)
      VALUES ($1)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `, [name]);

    return category;
  } catch (error) {
    throw error;
  }
}


/**
 ** Get All Categories
 * Gets all categories from categories table of database
 * @returns { array } a list of all categories
 */
async function getAllCategories() {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM categories;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}



module.exports = {
  createCategory,
  getAllCategories,
}