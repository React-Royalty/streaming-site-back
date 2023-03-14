// media posters db functions

const { client } = require("./index");


/**
 ** Add Poster to Media
 * Add a poster to a media by adding a new row to the media_posters database table.
 * @param { number } mediaId the id for the media
 * @param { number } posterId the id for the poster
 * @returns { object } the newly created media_posters row
 */
async function addPosterToMedia({ mediaId, posterId }) {
  try {
    const { rows: [ mediaPoster ] } = await client.query(`
      INSERT INTO media_posters("mediaId", "posterId")
      VALUES ($1, $2)
      RETURNING *;
    `, [ mediaId, posterId ]);

    return mediaPoster;
  } catch (error) {
    throw error;
  }
}


/**
 ** Delete Poster from Media
 * Delete a poster from a media by removing it from the media_posers database table.
 * @param { number } mediaPosterId the media poster id to be deleted
 * @returns { object } the newly deleted media_posters row
 */
async function deletePosterFromMedia(mediaPosterId) {
  try {
    const { rows: [mediaPoster] } = await client.query(`
      DELETE FROM media_posters
      WHERE id = $1
      RETURNING *;
    `, [mediaPosterId]);

    return mediaPoster;
  } catch (error) {
      console.log(error);
  }
}


/**
 ** Get All Media Posters
 * Gets and returns a list of all media posters in media_posters database table.
 * @returns { array } list of all media posters
 */
async function getAllMediaPosters() {
  try {
    const { rows: mediaPosters } = await client.query(`
      SELECT * FROM media_posters;
    `);

    return mediaPosters;
  } catch (error) {
    throw error;
  }
}


/**
 ** Get Media Poster by ID
 * Gets and returns a media poster by its ID
 * @param { number } mediaPosterId the media poster id
 * @returns { object } the media poster found by id
 */
async function getMediaPosterById(mediaPosterId) {
  try {
    const { rows: [ mediaPoster ] } = await client.query(`
      SELECT * 
      FROM media_posters
      WHERE id = $1;
    `, [mediaPosterId]);

    return mediaPoster;
  } catch (error) {
    throw error;
  }
}


/**
 ** Get Media Posters by Media ID
 * Gets and returns all media posters for a specified media id
 * @param { number } mediaId the media id to find media posters for
 * @returns { object } the media poster found by media id
 */
async function getMediaPostersByMediaId(mediaId) {
    try {
      const { rows: mediaPosters } = await client.query(`
        SELECT * 
        FROM media_posters
        WHERE "mediaId" = $1;
      `, [mediaId]);
  
      return mediaPosters;
    } catch (error) {
      throw error;
    }
  }


module.exports = {
  addPosterToMedia,
  deletePosterFromMedia,
  getAllMediaPosters,
  getMediaPosterById,
  getMediaPostersByMediaId
}