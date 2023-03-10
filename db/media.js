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


module.exports = {
  createMedia
}