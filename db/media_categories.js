// media categories db functions

const { client } = require("./index");


/**
 ** Add Category to Media
 * Add a category to a media
 * @param { string } name the name of the category
 * @returns { object } the newly created category
 */
async function addCategoryToMedia({ mediaId, categoryId }) {
  try {
    const { rows: [ mediaCategory ] } = await client.query(`
      INSERT INTO media_categories("mediaId", "categoryId")
      VALUES ($1, $2)
      RETURNING *;
    `, [ mediaId, categoryId ]);

    return mediaCategory;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  addCategoryToMedia
}