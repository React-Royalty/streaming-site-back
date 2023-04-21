// categories db functions

const { client } = require("./index");
const { getMediaByCategory } = require("./media");


/**
 ** Create Category
 * Inserts a new category into the database categories table - unless a category with that name already exists.
 * @param { string } name the name of the category
 * @returns { object } the newly created category
 */
async function createCategory(fields) {
  const insertString = Object.keys(fields).map(
    (key, index) => `"${ key }"`
  ).join(', ');

  const valuesString = Object.keys(fields).map(
    (key, index) => `$${ index + 1 }`
  ).join(', ');

  try {
    const { rows: [ category ] } = await client.query(`
      INSERT INTO categories (${insertString})
      VALUES (${valuesString})
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `, Object.values(fields));

    return category;
  } catch (error) {
    throw error;
  }
}


/**
 ** Get All Categories
 * Gets all categories from categories table of database.
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


/**
 ** Attach Media To Categories
 * Attaches media to category object so that they can be included in a @see getAllCategoriesWithMedia call.
 * @param { object } media the media objects that should be attached to the categories
 * @returns { object } the categories objects updated with attached media array
 */
async function attachMediaToCategories(media) {
  // no side effects
  const mediaToReturn = [...media];
  const binds = media.map((_, index) => `$${index + 1}`).join(', ');
  const mediaIds = media.map(indivMedia => indivMedia.id);
  if ( !mediaIds?.length ) return [];

  try {
    // get the categories, JOIN with media_categories (so we can get a mediaId), and only those that have those media ids on the media_categories join
    const { rows: categories } = await client.query(`
      SELECT media.*, media_categories.id AS "mediaCategoryId", media_categories."mediaId"
      FROM media 
      JOIN media_categories ON media_categories."categoryId" = categories.id
      WHERE media_categories."mediaId" IN (${ binds });
    `, mediaIds);

    // loop over the media
    for ( const indivMedia of mediaToReturn ) {
      // filter the categories to only include those that have this mediaId
      const categoriesToAdd = categories.filter(category => category.mediaId === indivMedia.id);
      // attach the categories to each single media
      indivMedia.categories = categoriesToAdd;
    }

    return mediaToReturn;
  } catch (error) {
    throw error;
  }
}


/**
 ** Attach Categories To Media
 * Attaches categories to media object so that they can be included in a @see getAllMedia() call.
 * @param { object } media the media objects the categories should be attached to
 * @returns { object } the media objects updated with a list of categories attribute
 */
async function attachCategoriesToMedia(media) {
  // no side effects
  const mediaToReturn = [...media];
  const binds = media.map((_, index) => `$${index + 1}`).join(', ');
  const mediaIds = media.map(indivMedia => indivMedia.id);
  if ( !mediaIds?.length ) return [];

  try {
    // get the categories, JOIN with media_categories (so we can get a mediaId), and only those that have those media ids on the media_categories join
    const { rows: categories } = await client.query(`
      SELECT categories.*, media_categories.id AS "mediaCategoryId", media_categories."mediaId"
      FROM categories 
      JOIN media_categories ON media_categories."categoryId" = categories.id
      WHERE media_categories."mediaId" IN (${ binds });
    `, mediaIds);

    // loop over the media
    for ( const indivMedia of mediaToReturn ) {
      // filter the categories to only include those that have this mediaId
      const categoriesToAdd = categories.filter(category => category.mediaId === indivMedia.id);
      // attach the categories to each single media
      indivMedia.categories = categoriesToAdd;
    }

    return mediaToReturn;
  } catch (error) {
    throw error;
  }
}


function organizeCategories(media) {
  media.genres = media.categories.filter(category => category.genre);
  media.vibes = media.categories.filter(category => category.vibe);
  return media;
}

module.exports = {
  createCategory,
  getAllCategories,
  attachCategoriesToMedia,
  organizeCategories
}