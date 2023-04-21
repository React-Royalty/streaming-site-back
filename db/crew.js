// crew db functions

const { client } = require("./index");


/**
 ** Create Crew
 * Inserts a new crew person into the database crew table - unless a crew member with that name already exists.
 * @param { string } name the name of the crew
 * @returns { object } the newly created crew
 */
async function createCrew(name) {
  try {
    const { rows: [ crew ] } = await client.query(`
      INSERT INTO crew (name)
      VALUES ($1)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `, [name]);

    return crew;
  } catch (error) {
    throw error;
  }
}


/**
 ** Get All Crew
 * Gets all crew from crew table of database.
 * @returns { array } a list of all crew
 */
async function getAllCrew() {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM crew;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}


function organizeCrew(media) {
  const organizedCrewMembers = {};
  organizedCrewMembers.directors = media.crew.filter(crewMember => crewMember.director);
  organizedCrewMembers.creators = media.crew.filter(crewMember => crewMember.creator);
  organizedCrewMembers.writers = media.crew.filter(crewMember => crewMember.writer);
  organizedCrewMembers.cast = media.crew.filter(crewMember => crewMember.cast);
  media.organizedCrew = organizedCrewMembers;
  return media;
}



module.exports = {
  createCrew,
  getAllCrew,
  organizeCrew
}