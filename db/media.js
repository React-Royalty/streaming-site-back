// media db functions

const { client } = require("./index");

const { attachCategoriesToMedia } = require("./categories");
const { attachPostersToMedia } = require("./posters");


/**
 ** Create Media
 * Inserts a new piece of media into the database media table - unless a media object with that title already exists.
 * @param { string } title the title for the new piece of media
 * @param { string } description the description for the new piece of media
 * @returns { object } the newly created media
 */
async function createMedia(fields) {
  const insertString = Object.keys(fields).map(
    (key, index) => `"${ key }"`
  ).join(', ');

  const valuesString = Object.keys(fields).map(
    (key, index) => `$${ index + 1 }`
  ).join(', ');


  try {
    const { rows: [ media ] } = await client.query(`
      INSERT INTO media(${insertString})
      VALUES (${valuesString})
      ON CONFLICT (title) DO NOTHING
      RETURNING *;
    `, Object.values(fields));

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
    SELECT media.id as "mediaId", 
    media.title,
    media.description,
    media."releaseYear",
    media."seasonsAvailable",
    media."maturityRating",
    media."maturityRatingDescription",
    media."runTime",
    CASE WHEN "media_categories"."mediaId" IS NULL THEN '[]'::json
    ELSE
    JSON_AGG(
        DISTINCT JSONB_BUILD_OBJECT(
            'categoryId', categories.id,
            'name', categories.name,
            'genre', categories.genre,
            'vibe', categories.vibe
        )
    ) END AS categories,
    CASE WHEN "media_crew"."mediaId" IS NULL THEN '[]'::json
    ELSE
    JSON_AGG(
        DISTINCT JSONB_BUILD_OBJECT(
            'crewId', crew.id,
            'name', crew.name,
            'director', "media_crew".director,
            'creator', "media_crew".creator,
            'writer', "media_crew".writer,
            'cast', "media_crew".cast
        )
    ) END AS crew,
    CASE WHEN posters."mediaId" IS NULL THEN '[]'::json
    ELSE
    JSON_AGG(
        DISTINCT JSONB_BUILD_OBJECT(
            'posterId', posters.id,
            'image', posters.image,
            'wide', posters.wide
        )
    ) END AS posters
    FROM media
    LEFT JOIN posters
        ON posters."mediaId" = media.id
    LEFT JOIN "media_crew" 
        ON media.id = "media_crew"."mediaId"
    LEFT JOIN "crew"
        ON crew.id = "media_crew"."crewId"
    LEFT JOIN "media_categories" 
        ON media.id = "media_categories"."mediaId"
    LEFT JOIN "categories"
        ON categories.id = "media_categories"."categoryId"
    GROUP BY media.id, "media_categories"."mediaId", "media_crew"."mediaId", posters."mediaId";
    `);

    return media;
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
  console.log("GETTING MEDIA BY CATEGORY");
  try {
    const { rows: mediaIds } = await client.query(`
      SELECT "mediaId" 
      FROM media_categories
      WHERE "categoryId" = $1;
    `, [categoryId]);

    const media = await Promise.all(mediaIds.map(mediaId => getMediaById(mediaId.mediaId)));
    const mediaWithPosters = await attachPostersToMedia(media);
    return attachCategoriesToMedia(mediaWithPosters);

  } catch (error) {
    throw error;
  }
}


// /**
//  ** Get All Categories With Media
//  * Gets and returns all categories with respective media attached.
//  * @returns { object } the categories with media attached
//  */
// async function getAllCategoriesWithMedia() {
//   try {
//     const { rows : categories } = await client.query(`
//     SELECT categories.id AS "categoryId", 
//     categories.name,
//     CASE WHEN "media_categories"."categoryId" IS NULL THEN '[]'::json
//     ELSE
//     JSON_AGG(
//         JSON_BUILD_OBJECT(
//             'mediaId', media.id,
//             'title', media.title,
//             'description', media.description
//         )
//     ) END AS media
//     FROM categories
//     LEFT JOIN "media_categories" 
//         ON categories.id = "media_categories"."categoryId"
//     LEFT JOIN "media"
//         ON media.id = "media_categories"."mediaId"
//     GROUP BY categories.id, "media_categories"."categoryId";
//     `);

//     console.log("categories", categories)

//     categories.forEach( async () => await AttachPostersAndCategoriesToMedia());


//     const posters = await AttachPostersAndCategoriesToMedia();

//     console.log("UGHDUGHDUGHDUGHDUGH", posters[0]);

//     return categories;

//   } catch (error) {
//     throw error;
//   }
// }


/**
 ** Get All Categories With Media
 * Gets and returns all categories with respective media attached.
 * @returns { object } the categories with media attached
 */
async function getAllCategoriesWithMedia() {
  try {
    const { rows : categories } = await client.query(`
    SELECT categories.id AS "categoryId", 
    categories.name,
    CASE WHEN "media_categories"."categoryId" IS NULL THEN '[]'::json
    ELSE
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'mediaId', mp."mediaId",
            'title', mp.title,
            'description', mp.description,
            'posters', mp.posters,
            'categories', mp.categories
            )
        
    ) END AS media
    FROM categories
    LEFT JOIN "media_categories" 
        ON categories.id = "media_categories"."categoryId"
    LEFT JOIN (
        SELECT media.id AS "mediaId", media.title, media.description,
        CASE WHEN "media_categories"."mediaId" IS NULL THEN '[]'::json
    ELSE
    JSON_AGG(
        DISTINCT JSONB_BUILD_OBJECT(
            'categoryId', categories.id,
            'name', categories.name
        )
    ) END AS categories,
        CASE WHEN posters."mediaId" IS NULL THEN '[]'::json
            ELSE
                JSON_AGG(
                    DISTINCT JSONB_BUILD_OBJECT(
                        'id', posters.id,
                        'image',posters.image,
                        'wide', posters.wide
                    )
                ) END AS posters
                FROM media
                LEFT JOIN posters
                ON posters."mediaId" = media.id
                LEFT JOIN "media_categories"
                ON "media_categories"."mediaId" = media.id
                LEFT JOIN categories
                ON "media_categories"."categoryId" = categories.id
                GROUP BY media.id, posters."mediaId", media_categories."mediaId"
                ) as mp on mp."mediaId" = "media_categories"."mediaId"
        GROUP BY categories.id, "media_categories"."categoryId";
    `);

    console.log("categories", categories)

    return categories;

  } catch (error) {
    throw error;
  }
}



/**
 ** Get All Categories With Media
 * Gets and returns all categories with respective media attached.
 * @returns { object } the categories with media attached
 */
async function getAllCategoriesWithMedia1() {
  console.log("ughhh")
  try {
    const { rows : categories } = await client.query(`
      SELECT * 
      FROM categories;
    `);

    console.log("categories pre media", categories);

    // const categoriesWithMedia = await Promise.all(categories.map(category => category.media = getMediaByCategory(category.id)));
    const categoriesWithMedia = categories.forEach( async (category) => category.media = await getMediaByCategory(category.id));
    console.log("categories POST media", categories);

    console.log("categoriesWithMedia", categoriesWithMedia)
    console.log("categories", categories[5])

    console.log("good job")

    return categories;

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
  getMediaByCategory,
  getAllCategoriesWithMedia
}