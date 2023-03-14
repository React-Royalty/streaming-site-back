// media db functions

const { attachCategoriesToMedia } = require("./categories");
const { client } = require("./index");


/**
 ** Create Media
 * Inserts a new piece of media into the database media table - unless a media object with that title already exists.
 * @param { string } title the title for the new piece of media
 * @param { string } description the description for the new piece of media
 * @returns { object } the newly created media
 */
async function createMedia({ title, description }) {

  try {
    const { rows: [ media ] } = await client.query(`
      INSERT INTO media(title, description)
      VALUES ($1, $2)
      ON CONFLICT (title) DO NOTHING
      RETURNING *;
    `, [title, description]);

    return media;
  } catch (error) {
    throw error;
  }
}


/**
 ** Update Media
 * Updates a piece of media in the database media table.
 * @param { number } mediaId the id for the media to be updated
 * @param { object } fields an object of new field values to update the media object with
 * @returns { object } the newly updated media
 * TODO: is there a more secure way to do this query?
 */
async function updateMedia(mediaId, fields) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(',');

  if ( setString.length === 0 ) return; // nothing was input to update

  try {
    const { rows: [ media ] } = await client.query(`
      UPDATE media 
      SET ${ setString }
      WHERE id = ${ mediaId }
      RETURNING *; 
    `, Object.values(fields));

    return media;
  } catch (error) {
    throw error;
  }
}


/**
 ** Delete Media
 * Deletes a piece of media from the database media table.
 * @param { number } mediaId the id for the media to be deleted
 * @returns { object } the recently deleted media
 */
async function deleteMedia(mediaId) {
  try {
    const { rows: [ media ] } = await client.query(`
      DELETE FROM media 
      WHERE id = $1 
      RETURNING *;
    `, [mediaId]);

    return media;
  } catch(error){
    console.log(error);
  }
}


/**
 ** Get All Media
 * Gets and returns all media from media table in database, attaches media's categories and posters.
 * @returns { array } an array of all media objects including categories array on each media
 */
async function getAllMedia() {
  try {
    const { rows: media } = await client.query(`
      SELECT *  
      FROM media;
    `);
    return attachCategoriesToMedia(media);
  } catch (error) {
    throw error;
  }
}


/**
 ** Get All Media Without Extra
 * Gets and returns all media from media table in database, does not attach extra attributes.
 * @returns { array } an array of all media
 */
async function getAllMediaWithoutExtra() {
  try {
    const { rows: media } = await client.query(`
      SELECT * 
      FROM media;
    `);

    return media;
  } catch (error) {
    throw error;
  }
}


/**
 ** Get Media By ID
 * Gets and returns a piece of media by its ID.
 * @param { number } id the media ID
 * @returns { object } the media found by its ID
 */
async function getMediaById(id) {
  try {
    const { rows: [ media ] } = await client.query(`
      SELECT * 
      FROM media
      WHERE id = $1;
    `, [id]);

    return media;
  } catch (error) {
    throw error;
  }
}


/**
 ** Get Media By ID With Categories
 * Gets and returns a piece of media by its ID and attaches its categories.
 * @param { number } id the media ID
 * @returns { object } the media found by its ID including attached categories
 */
async function getMediaByIdWithCategories(id) {
  try {
    const { rows: [ media ] } = await client.query(`
      SELECT * 
      FROM media
      WHERE id = $1;
    `, [id]);

    return attachCategoriesToMedia([media]);
  } catch (error) {
    throw error;
  }
}


/**
 ** Get Media By Title
 * Gets and returns a piece of media by its title.
 * @param { string } title the media title
 * @returns { object } the media found by its title
 */
async function getMediaByTitle(title) {
  try {
    const { rows: [ media ] } = await client.query(`
      SELECT * 
      FROM media
      WHERE title = $1;
    `, [title]);

    return media;
  } catch (error) {
    throw error;
  }
}


/**
 ** Get Media By Category
 * Gets and returns all media within a category.
 * @param { number } categoryId the category ID
 * @returns { object } the media found by category
 */
async function getMediaByCategory(categoryId) {
  try {
    const { rows: mediaIds } = await client.query(`
      SELECT "mediaId" 
      FROM media_categories
      WHERE "categoryId" = $1;
    `, [categoryId]);

    const media = await Promise.all(mediaIds.map(mediaId => getMediaById(mediaId.mediaId)));
    
    return attachCategoriesToMedia(media);

  } catch (error) {
    throw error;
  }
}


module.exports = {
  createMedia,
  updateMedia,
  deleteMedia,
  getAllMedia,
  getAllMediaWithoutExtra,
  getMediaById,
  getMediaByIdWithCategories,
  getMediaByTitle,
  getMediaByCategory
}