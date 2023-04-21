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
async function createPoster(fields) {
  const insertString = Object.keys(fields).map(
    (key, index) => `"${ key }"`
  ).join(', ');

  const valuesString = Object.keys(fields).map(
    (key, index) => `$${ index + 1 }`
  ).join(', ');

  try {
    const { rows: [ poster ] } = await client.query(`
      INSERT INTO posters (${insertString})
      VALUES (${valuesString})
      ON CONFLICT (image) DO NOTHING
      RETURNING *;
    `, Object.values(fields));

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


/**
 ** Attach Posters To Media
 * Attaches posters to media object so that they can be included in a @see getAllMedia() call.
 * @param { object } media the media objects the posters should be attached to
 * @returns { object } the media objects updated with a list of posters attribute
 */
async function attachPostersToMedia(media) {
  console.log("attaching posters to media...", media);
  // no side effects
  const mediaToReturn = [...media];
  const mediaIds = media.map(indivMedia => indivMedia.id);
  if ( !mediaIds?.length ) return [];

  try {
    // get the posters
    const posters = await getAllPosters();

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

function choosePosters(media) {
  const titleCards = media.posters.filter(poster => poster.titleCard);
  const wideTitleCards = titleCards.filter(poster => poster.wide);
  const tallTitleCards = titleCards.filter(poster => !poster.wide);
  media.wideTitleCard = wideTitleCards[~~(Math.random() * wideTitleCards.length)];
  media.tallTitleCard = tallTitleCards[~~(Math.random() * tallTitleCards.length)];
  const featuredPosters = media.posters.filter(poster => poster.featured);
  media.featuredPoster = featuredPosters[~~(Math.random() * featuredPosters.length)];
  const titleLogos = media.posters.filter(poster => poster.titleLogo);
  media.titleLogo = titleLogos[~~(Math.random() * titleLogos.length)];
  delete media["posters"];
  return media;
}

module.exports = {
  createPoster,
  getAllPosters,
  attachPostersToMedia,
  choosePosters
}