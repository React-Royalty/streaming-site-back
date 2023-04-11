// media crew db functions

const { client } = require("./index");


/**
 ** Add Crew to Media
 * Add a crew member to a media
 * @param { string } mediaId the media's id
 * @param { string } crewId the crew member's id
 * @returns { object } the newly created media crew
 */
async function addCrewToMedia(fields) {
  const insertString = Object.keys(fields).map(
    (key, index) => `"${ key }"`
  ).join(', ');

  const valuesString = Object.keys(fields).map(
    (key, index) => `$${ index + 1 }`
  ).join(', ');

  try {
    const { rows: [ mediaCrew ] } = await client.query(`
      INSERT INTO media_crew (${insertString})
      VALUES (${valuesString})
      RETURNING *;
    `, Object.values(fields));

    return mediaCrew;
  } catch (error) {
    throw error;
  }
}



module.exports = {
  addCrewToMedia
}