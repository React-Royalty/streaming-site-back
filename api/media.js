// media api router

const express = require("express");
const mediaRouter = express.Router();

// function imports
const { getAllMedia, getMediaById, getMediaByTitle, createMedia, updateMedia } = require("../db/media");
const { requireUser } = require("./utils");


// HTTP methods

/** 
** POST /api/media
 * Adds new media to media table in database. Requires an admin user
 * @see /db/media/createMedia 
 * TODO: Require an admin user
 */
// mediaRouter.post("/", requireUser, requireAdmin, async (req, res, next) => {
mediaRouter.post("/", requireUser, async (req, res, next) => {
  const { title, description, image } = req.body;

  try {
      const newMedia = await createMedia({ title, description, image });

      res.send({ 
        success: true,
        message: "New media created",
        media: newMedia
      });
  }catch ( { name, message } ) {
      next({ name, message })
  }
})


/** 
 ** PATCH /api/media/id
 * Updates media in the media table in the database. 
 * TODO: Require an admin user
 */
mediaRouter.patch('/:mediaId', requireUser, async (req, res, next) => {
  const { mediaId } = req.params;
  const { title, description, image } = req.body;

  const updateFields={};

  if (title) updateFields.title = natitleme;
  if (description) updateFields.description = description;
  if (image) updateFields.image = image;

  try {
    const media = await updateMedia(mediaId, updateFields);

    if (media) {
      res.send({
        success: true,
        message: "Media Updated",
        media: media
      })
    } else {
      next ({ 
        name: "ErrorUpdatingMedia",
        message: "An error occured while attempting to update media"
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});



/** 
** DELETE /api/media/id
* Deletes media from the media table in the database. Requires an admin user
* TODO: WRITE
*/


/**
 ** GET /api/media
 * Sends back a list of all media in the database
 * @see /db/media/getAllMedia 
 */
mediaRouter.get("/", async (req, res, next) => {
  try {
    const allMedia = await getAllMedia();

    res.send({ 
      success: true,
      allMedia: allMedia
    });
  } catch ({ name,message }){
    next({ name,message });
  }
});


/**
 ** GET /api/media/:id
 * Finds and sends back a media object by its ID
 * @see /db/media/getMediaById 
 */
mediaRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const media = await getMediaById(id);
    res.send({ 
      success: true,
      media: media
    });
  } catch ({ name, message }) {
    next({ name, message })
  }
});


/**
 ** GET /api/media/title/:title 
 * Finds and sends back a media object by its title
 * @see /db/media/getMediaByTitle
 */
mediaRouter.get('/title/:title', async (req,res,next) => {
  try{
    const { title } = req.params;
    const media = await getMediaByTitle(title);

    res.send({ 
      success: true,
      media: media
    });
  } catch ({ name, message }) {
    next({ name, message })
  }
});


module.exports = mediaRouter;