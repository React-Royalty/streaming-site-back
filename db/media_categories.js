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


/**
 ** Delete Category from Media
 * Delete a category from a media
 * @param { number } mediaCategoryId e name of the category
 * @returns { object } the newly deleted category
 */
async function deleteCategoryFromMedia(mediaCategoryId) {
  try {
    const { rows: [mediaCategory] } = await client.query(`
      DELETE FROM media_categories
      WHERE id = $1
      RETURNING *;
    `, [mediaCategoryId]);

    return mediaCategory;
  } catch (error) {
      console.log(error);
  }
}


/**
 ** Get All Media Categories
 * Gets and returns a list of all media categories in media_categories table of database.
 * @returns { array } array of all media categories
 */
async function getAllMediaCategories() {
  try {
    const { rows: mediaCategories } = await client.query(`
      SELECT * FROM media_categories;
    `);

    return mediaCategories;
  } catch (error) {
    throw error;
  }
}


/**
 ** Get Media Category by ID
 * Gets and returns a media category by its ID
 * @param { number } mediaCategoryId the media category id
 * @returns { object } the media category found by id
 */
async function getMediaCategoryById(mediaCategoryId) {
  try {
    const { rows: [ mediaCategory ] } = await client.query(`
      SELECT * 
      FROM media_categories
      WHERE id = $1;
    `, [mediaCategoryId]);

    return mediaCategory;
  } catch (error) {
    throw error;
  }
}


/**
 ** Get Media Categories by Media ID
 * Gets and returns all media categories for a specified media id
 * @param { number } mediaId the media id to find media categories for
 * @returns { object } the media category found by media id
 */
async function getMediaCategoriesByMediaId(mediaId) {
  // select and return an array of all routine_activity records
    try {
      const { rows: mediaCategories } = await client.query(`
        SELECT * 
        FROM media_categories
        WHERE "mediaId" = $1;
      `, [mediaId]);
  
      return mediaCategories;
    } catch (error) {
      throw error;
    }
  }


module.exports = {
  addCategoryToMedia,
  deleteCategoryFromMedia,
  getAllMediaCategories,
  getMediaCategoryById,
  getMediaCategoriesByMediaId
}