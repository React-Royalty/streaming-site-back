// media db functions

const { client } = require("./index");


/**
 ** Create Media
 * Inserts a new piece of media into the database media table - unless a media object with that title already exists.
 * @param { string } title the title for the new piece of media
 * @param { string } description the description for the new piece of media
 * @param { string } image the image url for the media poster
 * @returns { object } the newly created media
 */
async function createMedia({ title, description, image }) {

  try {
    const { rows: [ media ] } = await client.query(`
      INSERT INTO media(title, description, image)
      VALUES ($1, $2, $3)
      ON CONFLICT (title) DO NOTHING
      RETURNING *;
    `, [title, description, image]);

    return media;
  } catch (error) {
    throw error;
  }
}


/**
 ** Update Media
 * Updates a piece of media in the database media table.
 * @param { number } mediaId the id for the media to be updated
 * @param { array } fields a list of updated field values for the media object
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
 ** Get All Media
 * Gets and returns all media from media table in database
 * @returns { array } an array of all media
 */
async function getAllMedia() {
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
 * Gets and returns a piece of media by its ID
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
 ** Get Media By Title
 * Gets and returns a piece of media by its title
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
 ** Attach Category To Media
 * 
 * TODO: FIGURE OUT
 */
async function attachCategoriesToMedia(media) {
  // no side effects
  const mediaToReturn = [...media];
  const binds = media.map((_, index) => `$${index + 1}`).join(', ');
  const mediaIds = media.map(indivMedia => indivMedia.id);
  if ( !mediaIds?.length ) return [];

  try {
    // get the categories, JOIN with media_categories (so we can get a mediaId), and only those that have those media ids on the media_categories join
    const { rows: activities } = await client.query(`
      SELECT categories.*, media_categories.id AS "mediaCategoryId", media_categories."mediaId"
      FROM categories 
      JOIN media_activities ON media_activities."categoryId" = categories.id
      WHERE media_activities."mediaId" IN (${ binds });
    `, mediaIds);

    // loop over the media
    for(const indivMedia of mediaToReturn) {
      // filter the activities to only include those that have this routineId
      const categoriesToAdd = categories.filter(category => category.routineId === routine.id);
      // attach the activities to each single routine
      routine.activities = activitiesToAdd;
    }
    return routinesToReturn;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  createMedia,
  updateMedia,
  getAllMedia,
  getMediaById,
  getMediaByTitle,
  // attachCategoriesToMedia
}