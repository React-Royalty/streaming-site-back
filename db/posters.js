// posters db functions

const { client } = require("./index");


/**
 ** Create Poster
 * Inserts a new poster into the database posters table - unless a poster with that image url already exists.
 * @param { string } image the image url of the poster
 * @param { boolean } wide an indication of whether the poster has a wide ratio
 * @returns { object } the newly created poster
 */
async function createPoster({ image, wide }) {
  try {
    const { rows: [ poster ] } = await client.query(`
      INSERT INTO posters(image, wide)
      VALUES ($1, $2)
      ON CONFLICT (image) DO NOTHING
      RETURNING *;
    `, [image, wide]);

    return poster;
  } catch (error) {
    throw error;
  }
}


/**
 ** Get All Posters
 * Gets all posters from posters table of database
 * @returns { array } a list of all posters
 */
async function getAllPosters() {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM posters;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}


/**
 ** Attach Posters To Media
 * Attaches poster to media in the database media_posters table
 * @param { object } media the media object [or multiple media objects] the poster[s] should be attached to
 * @returns { object } the media object[s] updated with a list of posters attribute
 */
async function attachPostersToMedia(media) {
  // no side effects
  const mediaToReturn = [...media];
  const binds = media.map((_, index) => `$${index + 1}`).join(', ');
  const mediaIds = media.map(indivMedia => indivMedia.id);
  if ( !mediaIds?.length ) return [];

  try {
    // get the posters, JOIN with media_posters (so we can get a mediaId), and only those that have those media ids on the media_posters join
    const { rows: posters } = await client.query(`
      SELECT posters.*, media_posters.id AS "mediaPosterId", media_posters."mediaId"
      FROM posters 
      JOIN media_posters ON media_posters."posterId" = posters.id
      WHERE media_posters."mediaId" IN (${ binds });
    `, mediaIds);

    // loop over the media
    for ( const indivMedia of mediaToReturn ) {
      // filter the posters to only include those that have this mediaId
      const postersToAdd = posters.filter(poster => poster.mediaId === indivMedia.id);
      // attach the posters to each single media
      indivMedia.posters = postersToAdd;
    }

    return mediaToReturn;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  createPoster,
  getAllPosters,
  attachPostersToMedia
}