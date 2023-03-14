// posters db functions

const { client } = require("./index");


/**
 ** Create Poster
 * Inserts a new poster into the database posters table - unless a poster with that image url already exists.
 * @param { number } mediaId the id for the media associated with the poster
 * @param { string } image the image url of the poster
 * @param { boolean } wide an indication of whether the poster has a wide ratio
 * @returns { object } the newly created poster
 */
async function createPoster({ mediaId, image, wide }) {
  try {
    const { rows: [ poster ] } = await client.query(`
      INSERT INTO posters("mediaId", image, wide)
      VALUES ($1, $2, $3)
      ON CONFLICT (image) DO NOTHING
      RETURNING *;
    `, [mediaId, image, wide]);

    return poster;
  } catch (error) {
    throw error;
  }
}


/**
 ** Get All Posters
 * Gets all posters from posters table of database.
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




module.exports = {
  createPoster,
  getAllPosters
}